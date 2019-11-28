let dirs = ['N', 'W', 'S', 'E'];

class Cart {

	constructor(x, y, dir) {
		this.dir = dir;
		this.x = x;
		this.y = y;
		// left, straight, right
		this.next = 0;
	}

	followDir() {
		switch (this.dir) {
			case 'N':
				this.y--;
				break;
			case 'E':
				this.x++;
				break;
			case 'S':
				this.y++;
				break;
			case 'W':
				this.x--;
				break;
			default:
				console.error("Wrong direcrion " + this.dir);
				break;
		}
	}

	turnLeft() {
		this.dir = dirs[(5 + dirs.indexOf(this.dir)) % 4];
	}

	turnRight() {
		this.dir = dirs[(3 + dirs.indexOf(this.dir)) % 4];
	}

	rotateIntersection() {
		if(this.next === 0) {	// left
			this.turnLeft();
		} else if (this.next === 1) {	// straight
			// actually do nothing
		} else if(this.next === 2) {	// right
			this.turnRight();
		}

		this.next = (this.next + 1) % 3;
	}

	move(grid) {
		let c = grid[this.y][this.x];
		if(c === ' ') {
			console.error("Wrong position: " + this.x + ", " + this.y);
			noLoop();
		}
		
		if(c === '|' || c === '-' || c === '\\' || c === '/' || c === '+') {
			this.followDir();
		}

		let newC = grid[this.y][this.x];
		if(newC === ' ') {
			console.error("Wrong position: " + this.x + ", " + this.y);
			noLoop();
		}
		if(newC === '|' || newC === '-' || newC === '\\' || newC === '/' || newC === '+') {
			if(newC === '\\') {
				if(this.dir === 'W' || this.dir === 'E') {
					this.turnRight();
				} else {
					this.turnLeft();
				}
			} else if(newC === '/') {
				if(this.dir === 'E' || this.dir === 'W') {
					this.turnLeft();
				} else {
					this.turnRight();
				}
			} else if(newC === '+') {
				this.rotateIntersection();
			}
		}
	}

	show(res) {
		push();
		translate(this.x * res, this.y * res);
		// fix rotation
		// rotate(dirs.indexOf(this.dir) * -HALF_PI);
		stroke(255, 0, 0);
		beginShape();
		vertex(res / 2, 0);
		vertex(0, res);
		vertex(res, res);
		endShape(CLOSE);
		text(this.dir, res / 2, res / 2);

		pop();
	}

}