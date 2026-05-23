// LoginForm.jsx

import {useState} from 'react'
import {useMutation} from '@apollo/client/react'
import {LOGIN} from '../queries'

const LoginForm = ({setToken,setError})=> {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [login] = useMutation(LOGIN,{
		onCompleted : (data)=> {
			const token = data.login.value
			setToken(token)
			localStorage.setItem("phonebook-user-token",token)
		},
		onError : (error)=> {
			setError(error.message)
		}
	})

	const submit = event => {
		event.preventDefault()
		if(!username || !password){
			alert("Please fill in both username and password!")
			return false
		}
		login({variables : {username, password}})
		setUsername('')
		setPassword('')
	}

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					username <input
								value={username}
								onChange={({target})=> setUsername(target.value)}
							 />
				</div>
				<div>
					password <input
								value={password}
								onChange={({target})=> setPassword(target.value)}
							 />
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default LoginForm