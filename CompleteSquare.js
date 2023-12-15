class CompleteSquare {
  constructor(x, y, w, h, colour = [0, 255, 0, 0]) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.colour = colour;
  }
  
  draw() {
    noStroke();
    fill(this.colour);
    rect(this.x, this.y, this.w, this.h);
  }

  ifLevelComplete(player) {
    if (collideRectCircle(this.x, this.y, this.w, this.h, player.x, player.y, player.diameter)) {
      state = "gComplete";
    }
  }
}