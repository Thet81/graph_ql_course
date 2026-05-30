// server.js
const {startStandaloneServer} = require('@apollo/server/standalone')
const {ApolloServer} = require("@apollo/server")
const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const jwt = require('jsonwebtoken')
const User = require('./models/user')

const {ApolloServerPluginDrainHttpServer} = require("@apollo/server/plugin/drainHttpServer")
const {expressMiddleware} = require("@as-integrations/express5")
const cors = require('cors')
const express = require('express')
const {makeExecutableSchema} = require("@graphql-tools/schema")
const http = require("http")
const {WebSocketServer} = require('ws')
const {useServer} = require('graphql-ws/use/ws')

const getUserFromAuthHeader = async (auth)=> {
	if (!auth || !auth.startsWith(`Bearer `)){
		return null
	}

	try {
		const token = auth.substring(7)
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
		console.log("decoded token is ", decodedToken)
		return await User.findById(decodedToken.id).populate("friends")
	} catch (error) {
		console.error("JWT verification failed:", error.message)
		return null // Return null so introspection still works without logging in
	}
}

/*
since standAloneServer does not allow adding subscription
we'll use expressMiddleware instead

const startServer = (port) => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		introspection: true
	})

	startStandaloneServer(server,{
		listen : {port},
		// we can use the context in any resolver that we have defined
		context : async({req})=> {
			const auth = req.headers.authorization
			const currentUser = await getUserFromAuthHeader(auth)
			return {currentUser}
		}
	}).then(({url})=> {
		console.log(`Server ready at ${url}`)
	})
}
*/

const startServer = async(port)=> {
	const app = express()
	const httpServer = http.createServer(app)

	const wsServer = new WebSocketServer({
		server : httpServer,
		path : '/',
	})

	const schema = makeExecutableSchema({typeDefs,resolvers})
	const serverCleanup = useServer({schema}, wsServer)

	const server = new ApolloServer({
		schema,
		plugins : [
			ApolloServerPluginDrainHttpServer({httpServer}),
			{
				async serverWillStart(){
					return {
						async drainServer(){
							await serverCleanup.dispose();
						}
					}
				}
			}
		]
	})

	await server.start()

	app.use(
		'/',
		cors(),
		express.json(),
		expressMiddleware(server,{
			context : async ({req})=> {
				const auth = req.headers.authorization
				const currentUser = await getUserFromAuthHeader(auth)
				return {currentUser}
			}
		})
	)

	httpServer.listen(port,()=> {
		console.log(`Server is now running on port ${port}`)
	})

}

module.exports = startServer