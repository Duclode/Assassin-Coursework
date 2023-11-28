/** https://stackoverflow.blog/2023/02/13/coding-102-writing-code-other-people-can-read/ */
/** https://stackoverflow.blog/2023/04/10/whats-the-difference-between-software-engineering-and-computer-science-degrees/ */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 9; // not very good implamentation as the size of the map is viarble so having a static pixels value for speed makes the speed not consistant with different sizes
    this.diameter = cellSize * 0.7;
    this.dx = this.speed;
    this.dy = this.speed;
    this.facing = 'up'; // used for later for some pathfinding // might change to a precalculation of a target tile // will prob make a function instead

    //animations
    this.frame = 0; //current frame
    this.maxFrame = 0; // total no. of animation frames
    this.line = 0; // movement animations: 0:left, 1:right, 2:up, 3:down
    //frame rate throttling
    this.gameFrame = 0;
    this.staggerFrames = 2; // increasing slows down sprite animations

    //other
    this.default = {x: x, y: y};
  }

  draw() {
    //fill("purple");
    //circle(this.x, this.y, this.diameter);   // hitbox
    image(
      playerImg,
      this.x - this.diameter / 2 - 10, // originally no -10
      this.y - this.diameter / 2 - 15, // originally no -15
      this.diameter * 1.9, // originally no * 2
      this.diameter * 1.9,  // originally no * 2
      this.frame * 64, // tileSize
      this.line * 64, // tileSize
      64, // tileSize
      64 // tileSize
    )
  }

  /** 
  * theres a gap between the wall and the player at high speeds due to the player moving a greater distance each step
  * a way to fix this is to get the players current distance from the wall and move the player the different in their positions - 1
  * if the player is at (120, 30) and the wall is at (130, 30)px and the player moves right a distance of 15px a step
  * move the player (10 - 1)px to (129, 30)
  * p.x + (distance away - 1) e.g. p.x + (p.x(120) - wall.x(130) - 1) // *right direction*
  * I'll prob have to check if the distance between is < the speed of the player
  */
  // max 8, left 9, right 11, up, 8, down 10
  move() {
    this.maxFrame = 8 // frames start from 0
    if (keyIsDown(37) || keyIsDown(65)) {
      // left
      if (frameCount % 3 === 0) {
        this.line = 9;
        if (this.gameFrame % this.staggerFrames == 0) this.frame = ++this.frame % this.maxFrame;
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
        if (this.gameFrame % this.staggerFrames == 0) this.frame = ++this.frame % this.maxFrame;
        this.gameFrame++;
        if (!this.collisionCheck(this.x + this.dx, this.y)) {
          this.x += this.dx;
        }
      }
    } else if (keyIsDown(38) || keyIsDown(87)) {
      // up
      if (frameCount % 3 === 0) {
        this.line = 8;
        if (this.gameFrame % this.staggerFrames == 0) this.frame = ++this.frame % this.maxFrame;
        this.gameFrame++;
        if (!this.collisionCheck(this.x, this.y + -this.dy)) {
          this.y += -this.dy;
        }
      }
    } else if (keyIsDown(40) || keyIsDown(83)) {
      // down
      if (frameCount % 3 === 0) {
        this.line = 10;
        if (this.gameFrame % this.staggerFrames == 0) this.frame = ++this.frame % this.maxFrame;
        this.gameFrame++;
        if (!this.collisionCheck(this.x, this.y + this.dy)) {
          this.y += this.dy;
        }
      }
    }
  }
  // it was return too early was returning after the first iteration so was exiting the loop
  collisionCheck(posX, posY) {
    // loops through the tileMap/collisionMap
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        if (levelMap[y][x] == 1) { // 1 = wall tile
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
