// server.js
const {startStandaloneServer} = require('@apollo/server/standalone')
const {ApolloServer} = require("@apollo/server")
const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const jwt = require('jsonwebtoken')
const User = require('./models/user')

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

module.exports = startServer