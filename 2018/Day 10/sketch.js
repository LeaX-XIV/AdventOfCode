// https://adventofcode.com/2018/day/10
let lines;
let points = [];
let vels = [];
let w;
let h;
let vel = 7;
let seconds = 0;

function preload() {
	lines = loadStrings('input.txt', parseInput);
}

function parseInput(result) {
	result.forEach(l => {
		let x = parseInt(l.substr(10, 6));
		let y = parseInt(l.substr(18, 6));
		let vx =parseInt(l.substr(36, 2));
		let vy =parseInt(l.substr(40, 2));
		points.push(createVector(x, y));
		vels.push(createVector(vx, vy));
	});
	 
}

function setup() {
	w = windowWidth;
	h = windowHeight;
	createCanvas(w, h);
}

function draw() {
	//translate(w / 2, h / 2);
	for(let j = 0; j < vel; j++) {
		update(1);
	}
	show();
}

function mousePressed() {
	if(vel > 1) {
		vel = 1;
		noLoop();	
	} else {
		vel = 7;
		loop();
	}
}

function keyPressed() {
	if(vel === 1) {
		if(keyCode === LEFT_ARROW) {
			update(-1);
			show();
		} else if(keyCode === RIGHT_ARROW) {
			update(1);
			show();
		}
	}
}

function update(dir) {
	for(let i = 0; i < points.length; i++) {
		if(dir === 1) {
			points[i].add(vels[i]);
		} else if(dir === -1) {
			points[i].sub(vels[i]);
		}
	}
	seconds += dir;
}

// Part 1
function show() {	//LXJFKAXA
	background(3, 3, 10);
	stroke(255);
	strokeWeight(1);
	textSize(32);
	fill(255);
	// Part 2
	text(seconds, 0, h - 32);	// 10312
	if(vel > 1) {
		text("Premi il tasto sinistro per iniziare la navigazione manuale.", 0, 32);
	} else {
		text("Naviga nel tempo con le freccie destra e sinistra.", 0, 32);
	}
	points.forEach(p => {
		point(map(p.x, -400, 400, 0, w), map(p.y, -400, 400, 0, h)); //LXJFKAXA
	});
}