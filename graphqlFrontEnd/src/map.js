// map.js

const map = (array,func)=> {
	let newValue = [];
	for(let i = 0 ; i < array.length; i++){
		newValue.push(func(array[i]));
	}
	return newValue;
}

const filter = (array,func)=> {
	let newValue = [];
	for(let i = 0; i < array.length; i++){
		if (func(array[i])){
			newValue.push(array[i])
		}
	}
	return newValue
}
console.log(filter([1,2,3],(val)=> val > 2))