
import {gql} from '@apollo/client'
import {useQuery} from '@apollo/client/react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import {ALL_PERSONS} from './queries'
import {useState} from 'react'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'

const App = ()=> {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("phonebook-user-token"))

  const notify = (message)=> {
    setErrorMessage(message)
    setTimeout(()=> {
      setErrorMessage(null)
    },5000)
  }
  const result = useQuery(ALL_PERSONS)
  console.log("result is", result)

  if (result.loading) {
    return <div>loading....</div>
  }

  if (result.error){
    return <div>{result.error.message}</div>
  }

  if(!token){
    return (
      <div>
        <Notify errorMessage={errorMessage}/>
        <h2>login</h2>
        <LoginForm
          setToken={setToken}
          setErrorMessage={setErrorMessage}
        />
      </div>
    )
  }
  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <Persons persons={result.data.allPersons}/>
      <PersonForm setError={notify}/>
      <PhoneForm setError={notify}/>
    </div>
  )
}

export default App