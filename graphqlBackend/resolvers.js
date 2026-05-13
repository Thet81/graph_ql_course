// resolvers.js

const {GraphQLError} = require('graphql')
const {v1 : uuid} = require("uuid")

const Person = require('./models/person.js')

const resolvers = {
	Query : {
		personCount : async ()=> Person.collection.countDocument(),
		allPersons : async(root,args)=> {
			if(!args.phone){
				return Person.find({})
			}
			return Person.find({phone : {$exists : args.phone === 'YES'}})
		},
		findPerson : async (root,args)=> Person.findOne({name : args.name})
	},
	Person : {
		name : (root)=> {
			return root.name
		},
		address : ({street,city})=> {
			return {
				street,
				city,
			}
		}
	},
	Mutation : {
		addPerson : async (root,args)=>{
			console.log("args is ", args)
			const nameExists = await Person.exists({name : args.name})
			if (nameExists){
				throw new GraphQLError(`Name must be unique : ${args.name}`,{
					extensions : {
						code : 'BAD_USER_INPUT',
						invalidArgs : args.name,
					},
				})
			}
			// if the person details are not met with the validation defined in the 
			// mongoose schema, it will throw the error
			const person = new Person({...args})
			
			try {
				await person.save()
			}catch(error){
				throw new GraphQLError(`Saving the preson failed ${error.message}`,{
					extensions : {
						code : 'BAD_USER_INPUT',
						invalidArgs : args.name,
						error
					}
				})
			}
			return person
		},	
		editNumber : async (root, args) => {
			const person = await Person.findOne({name : args.name})

			if (!person){
				return null
			}

			person.phone = args.phone
			
			try{
				await person.save()
			}catch(error){
				throw new GraphQLError(`Editing the persons failed ${error.message}`, {
					extensions : {
						code : 'BAD_USER_INPUT',
						invalidArgs : args.name,
						error
					}
				})
			}

			return person
		}
	}
}


module.exports = resolvers