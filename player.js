class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 9;
		this.diameter = cellSize * 0.7;
		this.dx = this.speed;
		this.dy = this.speed;

		//animations
		this.frame = 0; //current frame
		this.maxFrame = 0; // total no. of animation frames
		this.line = 0; // movement animations: 0:left, 1:right, 2:up, 3:down
		//frame rate throttling
		this.gameFrame = 0;
		this.staggerFrames = 2; // increasing slows down sprite animations

		//other
		this.default = { x: x, y: y };
	}

	draw() {
		//fill("purple");
		//circle(this.x, this.y, this.diameter);   // hitbox (for testing)
		//draws player sprite to the screen
		image(
			playerImg,
			this.x - this.diameter / 2 - 10,
			this.y - this.diameter / 2 - 15,
			this.diameter * 1.9,
			this.diameter * 1.9,
			this.frame * 64, // tileSize
			this.line * 64, // tileSize
			64, // tileSize
			64 // tileSize
		);
	}

	// max 8, left 9, right 11, up, 8, down 10
	move() {
		//method for moving the player
		this.maxFrame = 8; // frames start from 0
		if (keyIsDown(37) || keyIsDown(65)) {
			// left
			if (frameCount % 3 === 0) {
				this.line = 9;
				if (this.gameFrame % this.staggerFrames == 0)
					this.frame = ++this.frame % this.maxFrame;
				this.gameFrame++;
				if (!this.collisionCheck(this.x + -this.dx, this.y)) {
					// the simulated new position is pre-calculated before the function call
					this.x += -this.dx;
				}
			}
		} else if (keyIsDown(39) || keyIsDown(68)) {
			// right
			if (frameCount % 3 === 0) {
				this.line = 11;
				if (this.gameFrame % this.staggerFrames == 0)
					this.frame = ++this.frame % this.maxFrame;
				this.gameFrame++;
				if (!this.collisionCheck(this.x + this.dx, this.y)) {
					this.x += this.dx;
				}
			}
		} else if (keyIsDown(38) || keyIsDown(87)) {
			// up
			if (frameCount % 3 === 0) {
				this.line = 8;
				if (this.gameFrame % this.staggerFrames == 0)
					this.frame = ++this.frame % this.maxFrame;
				this.gameFrame++;
				if (!this.collisionCheck(this.x, this.y + -this.dy)) {
					this.y += -this.dy;
				}
			}
		} else if (keyIsDown(40) || keyIsDown(83)) {
			// down
			if (frameCount % 3 === 0) {
				this.line = 10;
				if (this.gameFrame % this.staggerFrames == 0)
					this.frame = ++this.frame % this.maxFrame;
				this.gameFrame++;
				if (!this.collisionCheck(this.x, this.y + this.dy)) {
					this.y += this.dy;
				}
			}
		}
	}

	collisionCheck(posX, posY) {
		// loops through the tileMap/collisionMap
		for (let y = 0; y < mapHeight; y++) {
			for (let x = 0; x < mapWidth; x++) {
				if (levelMap[y][x] == 1) {
					// 1 = wall tile
					if (
						// p5.collide2d function to checks for a collision
						collideRectCircle(
							x * cellSize,
							y * cellSize,
							cellSize,
							cellSize,
							posX,
							posY,
							this.diameter
						)
					) {
						return true;
					}
				}
			}
		}
		return false;
	}
}
