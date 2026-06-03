
import {gql} from '@apollo/client'
import {useQuery, useApolloClient, useSubscription} from '@apollo/client/react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import {ALL_PERSONS, PERSON_ADDED} from './queries'
import {useState} from 'react'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'
import {addPersonToCache} from './utils/apolloCache'
const App = ()=> {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("phonebook-user-token"))
  const client = useApolloClient()

  useSubscription (PERSON_ADDED,{
    onData : ({data})=> {
      // console.log(data)
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      addPersonToCache(client.cache, addedPerson)
    }
  })
  const notify = (message)=> {
    setErrorMessage(message)
    setTimeout(()=> {
      setErrorMessage(null)
    },5000)
  }

  const onLogout = ()=> {
    localStorage.clear()
    setToken(null);
    client.resetStore()
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
          setError = {notify}
        />
      </div>
    )
  }
  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <button onClick={onLogout}>logout</button>
      <Persons persons={result.data.allPersons}/>
      <PersonForm setError={notify}/>
      <PhoneForm setError={notify}/>
    </div>
  )
}

export default App