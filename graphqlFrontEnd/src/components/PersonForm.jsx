// PersonForm.jsx
import {useState} from 'react'
import {gql} from '@apollo/client'
import {useMutation} from '@apollo/client/react'

const CREATE_PERSON	 = gql`
	mutation createPerson(
		$name : String!
		$street : String!
		$city : String!
		$phone : String
	){
		addPerson(name : $name, street : $street, city : $city, phone : $phone){
			name
			phone
			id 
			address {
				street
				city
			}
		}
	}
`

const PersonForm = ()=> {
	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [street, setStreet] = useState('')
	const [city, setCity] = useState('')

	const [createPerson] = useMutation(CREATE_PERSON)

	const submit = (e)=> {
		e.preventDefault()
		console.log(name,phone,street,city)
		createPerson({variables : {name,phone,street,city}})
		setName('')
		setPhone('')
		setStreet('')
		setCity('')
	}
	return (
		<div>
			<h2>create new </h2>
			<form onSubmit={submit}>
				<div>
					name <input
							value={name}
							onChange={({target})=> setName(target.value)}
						 />
				</div>
				<div>
					phone <input
							value={phone}
							onChange={({target})=> setPhone(target.value)}
						 />
				</div>
				<div>
					street <input
							value={street}
							onChange={({target})=> setStreet(target.value)}
						 />
				</div>
				<div>
					city <input
							value={city}
							onChange={({target})=> setCity(target.value)}
						 />
				</div>
				<div>
					<button type="submit">add!</button>
				</div>	

			</form>
		</div>
	)
}

export default PersonForm;