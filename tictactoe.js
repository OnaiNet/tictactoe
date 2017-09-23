var cells = [
	null, null, null, 
	null, null, null, 
	null, null, null
];

var boardFull = 0b111111111;

/// Test...   null means nobody has gone there yet
cells = [
	'X', 'O', 'O',
	'X', 'X', 'O',
	'O', null, 'X'
];
//*/

var winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].map((winPattern) => {
	var sum = winPattern.reduce((sum, cur, idx) => {
		if (idx === 1) sum = Math.pow(2, sum);
		return sum + Math.pow(2, cur);
	});
	return sum;
});


var checkStatus = function() {
	var xSum = 0, oSum = 0;

	for (var x = 0; x < cells.length; x++) {
		xSum += cells[x] == 'X' ? Math.pow(2, x) : 0;
		oSum += cells[x] == 'O' ? Math.pow(2, x) : 0;
	}

	for (var x = 0; x < winPatterns.length; x++) {
		var goal = winPatterns[x];
		if ((xSum & goal) === goal) {
			console.log('X wins!');
			return;
		} else if ((oSum & goal) === goal) {
			console.log('O wins!');
			return;
		}
	}

	if ((xSum + oSum) === boardFull) {
		console.log('Stalemate!');
		return;
	}

	console.log('The battle continues...');
};

//console.log(cells);
//console.log(winPatterns);

checkStatus();