// Person.jsx

const Person = ({persons})=> {
	return (
		<div>
			{persons.map(person => person.name).join(", ")}
		</div>
	)
}

export default Person;