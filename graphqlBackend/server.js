// server.js
const {startStandaloneServer} = require('@apollo/server/standalone')
const {ApolloServer} = require("@apollo/server")
const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const startServer = (port) => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})

	startStandaloneServer(server,{
		listen : {port},
	}).then(({url})=> {
		console.log(`Server ready at ${url}`)
	})
}

module.exports = startServer