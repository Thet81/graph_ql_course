// apolloCache.js

import {ALL_PERSON} from '../queries'

export const addPersonToCache = (cache, personToAdd)=> {
	cache.updateQuery({query : ALL_PERSON},({allPersons})=> {
		const personExists = allPersons.some(
			(person)=> person.id === personToAdd.id,
		)

		if(personExists){
			return {
				allPersons
			}
		}

		return {
			allPersons : allPersons.concat(personToAdd)
		}
	})
}