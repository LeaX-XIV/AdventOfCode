let grid = [];
let fighters = [];
let goblins = [];
let elfs = [];
let res = 20;
let rounds = 0;

function preload () {
	let lines = loadStrings("input.txt", parse);
}

function parse(lines) {
	let id = 0;
	for(let j = 0; j < lines.length; j++) {
		grid.push([]);

		for(let i = 0; i < lines.length; i++) {
			let c = lines[j].charAt(i);
			if(c === '#' || c === '.') {
				grid[j][i] = c;
			} else if(c === 'G') {
				let g = new Fighter('G', i, j, id++);
				fighters.push(g);
				goblins.push(g);
				grid[j][i] = '.';
			} else if(c === 'E') {
				let e = new Fighter('E', i, j, id++);
				fighters.push(e);
				elfs.push(e);
				grid[j][i] = '.';
			}
		}
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(1);
	drawMap();
	drawFighters();
}

function draw() {
	if(goblins.length == 0 || elfs.length == 0) {
		noLoop();
	}
	fighters.sort(posCmp);

	for(let k = 0; k < fighters.length; k++) {
		let current = fighters[k];
		let targetAdjacent = [];
		for(let l = 0; l < fighters.length; l++) {
			if(current.faction != fighters[l].faction) {
				let x = fighters[l].x;
				let y = fighters[l].y;
				if(grid[y][x-1] == '.') {
					targetAdjacent.push({x: x-1, y: y});
				}
				if(grid[y][x+1] == '.') {
					targetAdjacent.push({x: x+1, y: y});
				}
				if(grid[y-1][x] == '.') {
					targetAdjacent.push({x: x, y: y-1});
				}
				if(grid[y+1][x] == '.') {
					targetAdjacent.push({x: x, y: y+1});
				}
			}
		}

		targetAdjacent.sort(posCmp);
		let pick = targetAdjacent[0];
		let dx = pick.x - current.x;
		let dy = pick.y - current.y;

		current.x += dx;
		current.y += dy;























	}










































	drawMap();
	drawFighters();
	rounds++;
}

function drawMap() {
	background(255);
	for(let j = 0; j < grid.length; j++) {
		for(let i = 0; i < grid[j].length; i++) {
			push();
			let c = grid[j][i];
			translate(i * res, j * res);
			if(c === '#') {	// Wall
				stroke(0);
				fill(0);
				rect(0, 0, res, res);
			}
			pop();
		}
	}
}

function drawFighters() {
	fighters.forEach(f => f.show());
}

function posCmp(a, b) {
	return a.y - b.y == 0 ? a.x - b.x : a.y - b.y;
}