class Camera {
  constructor(x, y, arcRadius, heading, fov, colour) {
    this.x = x;
    this.y = y;
    this.arcRadius = arcRadius;
    this.heading = heading;
    this.fov = fov;
    this.colour = colour;
  }

  drawCamera() {
    /** arc(x, y, width, height, angleStart, angleStop, [mode]) */
    stroke(3);
    push();
    translate(this.x, this.y);
    rotate(this.heading);
    fill(this.colour);
    arc(
      0,
      0,
      this.arcRadius,
      this.arcRadius,
      -this.fov / 2, //this.heading - this.fov,
      this.fov / 2, //this.heading + this.fov / 2,
      PIE
      );
    pop();
  } //endmethod

  update(x, y, arcRadius, heading, fov, colour) {
    this.x = x;
    this.y = y;
    this.arcRadius = arcRadius;
    this.heading = heading;
    this.fov = fov; 
  } //endmethod
}