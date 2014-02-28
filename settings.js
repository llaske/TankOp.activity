
settings = {};


// Functions to generate tags
settings.typeNumber = function() {
	var number = Math.floor(Math.random()*11);
	return { tag: ""+number, result: number };
}

settings.generateFunctionAddFromTo = function(start, end) {
	var difference = end-start+1;
	return function() {
		var number1 = start+Math.floor(Math.random()*difference);
		var number2 = start+Math.floor(Math.random()*difference);
		return { tag: ""+number1+"+"+number2, result: number1+number2 }
	}
}

// Levels
settings.levels = [
	{
		name: "TYPE NUMBER",
		map: "grass",
		defense: [4, 0, 4, 0, 0],
		attack: 22,
		stats: [10, 10, 0, 9, 10],
		generator: settings.typeNumber,
		completed: false
	},
	{
		name: "ADDITION 1 TO 3",
		map: "trees",
		defense: [4, 2, 2, 0, 0],
		attack: 20,
		stats: [10, 0, 8, 10, 10],
		generator: settings.generateFunctionAddFromTo(1, 3),
		completed: false
	},	
	{
		name: "ADDITION 0 TO 5",
		map: "mountain",
		defense: [4, 3, 1, 0, 0],
		attack: 30,
		stats: [10, 0, 8, 10, 9],
		generator: settings.generateFunctionAddFromTo(0, 5),
		completed: false
	},
	{
		name: "SUMS TO 10",
		map: "grass",
		defense: [4, 0, 4, 0, 0],
		attack: 30,
		stats: [10, 10, 0, 8, 0],
		generator: settings.generateFunctionAddFromTo(0, 10),
		completed: false
	},
	{
		name: "SUMS TO 15",
		map: "trees",
		defense: [4, 2, 2, 0, 0],
		attack: 30,
		stats: [10, 0, 7, 10, 10],
		generator: settings.generateFunctionAddFromTo(0, 15),
		completed: false
	},	
	{
		name: "SUMS TO 20",
		map: "mountain",
		defense: [4, 3, 1, 0, 0],
		attack: 40,
		stats: [10, 0, 7, 10, 9],
		generator: settings.generateFunctionAddFromTo(0, 20),
		completed: false
	}	
];
