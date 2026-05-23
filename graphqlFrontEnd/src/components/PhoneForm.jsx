// PhoneForm.jsx
import {useMutation} from '@apollo/client/react'
import {EDIT_NUMBER} from '../queries'
import {useState} from 'react'

const PhoneForm = ({setError})=> {
	const [name,setName] = useState("")
	const [phone, setPhone] = useState("")

	const [changeNumber] = useMutation(EDIT_NUMBER,{
		onCompleted : (data)=> {
			console.log(data)
			if(!data.editNumber){
				setError('person not found')
			}
		}
	})

	const submit = async (event)=> {
		event.preventDefault()

		try{
			await changeNumber({variables : {name,phone}})
		}catch(error){
			setError(error.message)
		}
		setName('')
		setPhone('')
	}

	return (
		<div>
			<h2>Change Numeber</h2>
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
				<button type="submit">save</button>
			</form>
		</div>
	)
}

export default PhoneForm;