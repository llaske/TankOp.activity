
settings = {};


// Functions
settings.typeNumber = function() {
	var number = Math.floor(Math.random()*11);
	return { tag: ""+number, result: number };
}

// Levels
settings.levels = [
	{
		map: "grass",
		defense: [4, 0, 0, 4, 0],
		attack: 20,
		stats: [10, 10, 0, 9, 10],
		generator: settings.typeNumber
	}
];
