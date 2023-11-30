class Button {
  constructor(posX, posY, width, height, text, colour = [31, 164, 204], showCircle = true, unlocked = true, rounded = 0, font = karashaFont){
   this.pos = createVector(posX, posY);
    this.rectSize = createVector(width, height);
    this.rounded = rounded
    this.text = text;
    this.font = font
    this.colour = colour;
    this.pressed = false;
    this.inside = false;
    this.showCircle = showCircle
    this.unlocked = unlocked
  }

  draw() {
    this.pressed ? fill(255, 255, 255, 20) : fill(...this.colour);
    //displays a circle next to the button on hover
    if(this.inside && this.showCircle) {
      //circle(this.pos.x - 75, this.pos.y + this.rectSize.y / 2, 30); /* bug testing */
      image(shuriken, this.pos.x - 100, this.pos.y + this.rectSize.y / 2 - 25);
      image(shuriken, this.pos.x + this.rectSize.x + 45, this.pos.y + this.rectSize.y / 2 - 25); 
    };
    stroke(3);
    rect(this.pos.x, this.pos.y, this.rectSize.x, this.rectSize.y, this.rounded);
    
    // draws the text at the centre of the rectangle
    textAlign(CENTER, CENTER);
    textFont(this.font);
    textSize(32);
    fill(0);
    text(this.text, this.pos.x + this.rectSize.x / 2, this.pos.y + this.rectSize.y / 2)
  }

  update() {
    const mouse = createVector(mouseX, mouseY);
    collidePointRectVector(mouse, this.pos, this.rectSize) ? this.inside = true : this.inside = false;
    (this.inside && mouseIsPressed) ? this.pressed = true : this.pressed = false;
  }
}