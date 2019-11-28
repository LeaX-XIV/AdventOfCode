let carts = [];
let grid = [];
let res = 7;
let part1 = false;

function preload() {
	let lines = loadStrings('input.txt', parseInput);
}

function parseInput(result) {
	result.forEach( (line, i) => {
		grid[i] = [];
		line.split("").forEach((char, j) => {
			if(char === 'v') {
				carts.push(new Cart(j, i, 'S'));
				char = '|';
			} else if(char === '^') {
				carts.push(new Cart(j, i, 'N'));
				char = '|';
			} else if(char === '<') {
				carts.push(new Cart(j, i, 'W'));
				char = '-';
			} else if(char === '>') {
				carts.push(new Cart(j, i, 'E'));
				char = '-';
			}
			grid[i][j] = char;
		});
	});
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
}

function draw() {
	background(255);
	
	drawGrid();
	
	if(carts.length === 1) {
		let c = carts[0];
		console.log(c.x + "," + c.y);	// 145,88
		noLoop();
	}
	
	
	// Order carts to preserve movement order
	// Reversing order to allow reverse iteration and splicing
	carts.sort( (b, a) => a.y - b.y !== 0 ? a.y - b.y : b.x - a.x);
	for(let i = carts.length - 1; i >= 0; i--) {
		let c = carts[i];
		c.move(grid);
		c.show(res);
		for(let j = carts.length - 1; j >= 0; j--) {
			let cart = carts[j];
			if(i !== j) {
				if(c.x == cart.x && c.y == cart.y) {
					if(part1 === false) {
						console.log(c.x + "," + c.y); // 124,90
						part1 = true;
					}
					// Part 2
					// Remove crashing carts
					carts.splice(max(i, j), 1);
					carts.splice(min(i, j), 1);
				}
			}
		}
	}
}

function drawGrid() {
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			push();
			translate(j * res, i * res);
			let c = grid[i][j];

			if(c === '|') {
				line(res / 2, 0, res / 2, res);
			} else if(c === '-') {
				line(0, res / 2, res, res / 2);
			} else if(c === '+') {
				line(res / 2, 0, res / 2, res);
				line(0, res / 2, res, res / 2);
			} else if(c === '\\') {
				rect(0, 0, res, res);
			} else if(c === '/') {
				rect(0, 0, res, res);
			}
			pop();
		}
	}
}