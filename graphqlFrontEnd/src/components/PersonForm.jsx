// PersonForm.jsx
import {useState} from 'react'
import {gql} from '@apollo/client'
import {useMutation} from '@apollo/client/react'
import {ALL_PERSONS, CREATE_PERSON} from '../queries'

const PersonForm = ({setError})=> {
	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [street, setStreet] = useState('')
	const [city, setCity] = useState('')

	const [createPerson] = useMutation(CREATE_PERSON,{
		refetchQueries : [{query : ALL_PERSONS}],
		onError : (error)=> setError(error.message),
	})

	const submit = (e)=> {
		e.preventDefault()
		console.log(name,phone,street,city)
		createPerson({variables : {
			name,
			street,
			city,
			phone : phone.length > 0 ? phone : undefined
		}})
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