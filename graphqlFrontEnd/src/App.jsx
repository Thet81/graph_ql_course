
import {gql} from '@apollo/client'
import {useQuery} from '@apollo/client/react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import {ALL_PERSONS} from './queries'
import {useState} from 'react'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
 
const App = ()=> {
  const [errorMessage, setErrorMessage] = useState(null);

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