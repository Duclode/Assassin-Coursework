class Enemy {
	constructor({
		x,
		y,
		speed = 2.6,
		route = "vertical",
		facing = "down",
		visionRadius = 10,
		fov = 4,
		visionType = "cone",
		blink = false,
	}) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.diameter = cellSize * 0.7;
		this.dx = this.speed;
		this.dy = this.speed;

		/* vision cone */
		this.blink = blink;
		this.visionType = visionType;
		this.facing = facing;
		this.direction = {
			up: { faceDirection: -Math.PI / 2, travelDirection: -this.dy },
			down: { faceDirection: Math.PI / 2, travelDirection: this.dy },
			left: { faceDirection: Math.PI, travelDirection: -this.dx },
			right: { faceDirection: 0, travelDirection: this.dx },
		};

		this.arcRadius = cellSize * visionRadius; // change length (radius) of cone
		this.heading = this.direction[this.facing]["faceDirection"];
		this.fov = Math.PI / fov;
		this.rotationAngle = -Math.PI;
		this.camColour = [0, 255, 0, 80];
		this.camera = new Camera(
			this.x,
			this.y,
			this.arcRadius,
			this.heading,
			this.fov,
			this.camColour
		);

		/* patrol */
		this.patrolMode = { type: route, fixedCam: false }; // type: vertical, horizontal, stationary

		/* Sprite */
		this.frame = 0;
		this.maxFrame = 6; // frames start from 0
		this.line = 1;
		/* framerate throttling */
		this.gameFrame = 0;
		this.staggerFrames = 10; // increasing slows down sprite animations

		//other
		this.default = {
			x: x,
			y: y,
			dx: speed,
			dy: speed,
			route: route,
			facing: facing,
		};
	} //endconstructor

	draw() {
		/* hitbox debug */
		if (this.patrolMode.type == "stationary") {
			this.maxFrame = 4;
			this.line = 0;
		}
		fill(this.camColour);
		//circle(this.x, this.y, this.diameter);
		if (this.visionType == "area") circle(this.x, this.y, this.arcRadius);
		if (this.gameFrame % this.staggerFrames == 0) {
			this.frame = ++this.frame % this.maxFrame;
		}
		if (this.visionType == "cone") {
			this.refreshCamera();
			this.camera.drawCamera();
		}
		image(
			slimeEnemy,
			this.x - this.diameter - 4,
			this.y - this.diameter - 6,
			this.diameter * 2.3,
			this.diameter * 2.3,
			this.frame * tileSize,
			this.line * tileSize,
			tileSize,
			tileSize
		);
		this.gameFrame++;
		/** Debug */
		// const pathKeys = Object.keys(this.direction);
		// console.log(pathKeys);
		// let pathKeys = Object.keys(this.direction);
		// console.log(pathKeys);
		// console.log(this.direction['up']);
	}

	cameraVision(player) {
		// collidePointArc(pointX, pointY, arcCenterX, arcCenterY, arcRadius, arcRotationAngle, arcAngle, [buffer])
		if (this.visionType !== "cone") return;
		if (
			collidePointArc(
				player.x,
				player.y,
				this.camera.x,
				this.camera.y,
				this.camera.arcRadius / 2,
				this.camera.heading,
				this.camera.fov
			)
		) {
			this.camera.colour = [255, 0, 0, 80];
			state = "gOver";
		} else {
			this.camera.colour = this.camColour;
		}
		//console.log(`cameraPOS: ${this.camera.x}, ${this.camera.y}`); (testing)
	} //endMethod

	areaVision(player) {
		if (this.visionType !== "area") return;
		if (
			collideCircleCircle(
				this.x,
				this.y,
				this.arcRadius, // is just the radius of circle but the cone uses same property
				player.x,
				player.y,
				player.diameter
			)
		) {
			this.camera.colour = [255, 0, 0, 80];
			state = "gOver";
		} else {
			this.camera.colour = this.camColour;
		}
	}

	patrol() {
		if (this.patrolMode.type == "wallHug") {
			this.wallFollowPath();
		} else if (
			this.patrolMode.type == "vertical" ||
			this.patrolMode.type == "horizontal"
		) {
			this.straightPath();
		} else {
			return;
		}
	} //endMethod

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
	} //endMethod

	refreshCamera() {
		this.camera.update(
			this.x,
			this.y,
			this.arcRadius,
			this.heading,
			this.fov,
			this.camColour
		);
	}

	straightPath() {
		if (this.patrolMode.type == "horizontal") {
			if (this.facing == "up" || this.facing == "down") {
				// correctly orients the enemy
				this.facing = "right";
				this.heading = this.direction[this.facing]["faceDirection"];
			}
			if (!this.collisionCheck(this.x + this.dx, this.y)) {
				// the simulated new position is pre-calculated before the function call
				this.x += this.dx;
			} else {
				this.dx *= -1;
				if (!this.patrolMode.fixedCam) {
					// allows option for cameras to be fixed while patrolling
					this.facing == "left"
						? (this.facing = "right")
						: (this.facing = "left");
					this.heading = this.direction[this.facing]["faceDirection"];
				}
			}
		} else if (this.patrolMode.type == "vertical") {
			if (this.facing == "left" || this.facing == "right") {
				// correctly orients the enemy
				this.facing = "down";
				this.heading = this.direction[this.facing]["faceDirection"];
			}
			if (!this.collisionCheck(this.x, this.y + this.dy)) {
				// on collision reverses the enemies direction
				this.y += this.dy;
			} else {
				this.dy *= -1;
				if (!this.patrolMode.fixedCam) {
					// allows option for cameras to be fixed while patrolling
					this.facing == "up" ? (this.facing = "down") : (this.facing = "up");
					this.heading = this.direction[this.facing]["faceDirection"];
				}
			}
		}
	} // endMethod

	wallFollowPath() {
		if (this.facing == "up") {
			if (!this.collisionCheck(this.x, this.y + this.dy)) {
				this.y += -this.dy;
			}
		} else if (this.collisionCheck(this.x, this.y + this.dy)) {
			this.facing = "right";
			this.heading = this.direction[this.facing]["faceDirection"];
		}
		if ((this.facing = "right")) {
			if (!this.collisionCheck(this.x + this.dx, this.y)) {
				this.x += this.dx;
			}
		}
		/**  
    // try using a while loops instead of if statements actually it might work fine with if statements -_-
    example:
    while/if (facing == 'up') {
      this.y += this.dy;
      if (collisionCheck(this.x, this.y + this.dy)) { // so it switches the facing direction which should exit out of the while loop
      this.facing = 'right';
      break; // maybe a precaution of it doesn't break it out
      }
    }
    while/if (facing == 'right') {
      this.x += this.dx;
      if (collisonCheck(this.x + this.dx, this.y)) {
      this.facing = 'down';
      break;
      }
    }
    // and repeat etc
    */
	} //endMethod
} //endClass
