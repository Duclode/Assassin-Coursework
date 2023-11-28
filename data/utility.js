function getKeyByValue (object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
//runs a function only once
function once(fn, context) {
  let result;
  return function() {
    if(fn) {
      result = fn.apply(context || this, arguments);
      fn = context = null;
    }
    return result;
  };
}
/*
const pathKeys = Object.keys(this.direction);
if (!(this.collisionCheck(this.x + this.dx, this.y) && this.collisionCheck(this.x, this.y + this.dy))) {
  if (this.facing == 'up') {
    this.y += this.dy;
  } else if (this.facing == 'down') {
    this.y += this.dy;
  } else if (this.facing == 'left'){
    this.x += this.dx;
  } else if (this.facing == 'right'){
    this.x += this.dx;
  }
} else {
  if (this.facing == 'up') {
    this.facing = 'right';
    this.heading = this.direction[this.facing].faceDirection;
    this.dx = this.speed;
  } else if (this.facing == 'right') {
    this.facing = 'down';
    this.dy + this.speed;
    this.heading = this.direction[this.facing].faceDirection;
  } else if (this.facing == 'down'){
    this.facing = 'left';
    this.heading = this.direction[this.facing].faceDirection;
    this.dx = -this.speed;
  } else if (this.facing == 'left'){
    this.facing = 'up';
    this.heading = this.direction[this.facing].faceDirection;
    this.dy = -this.speed;
  }
}
*/
/*
if (!this.collisionCheck((this.x + this.dx, this.y)) && !this.collisionCheck(this.x, this.y + this.dy)) {
  // the simulated new position is pre-calculated before the function call
  this.collideCount += 1;
  this.facing = this.direction[pathKeys[count]];
  this.heading = this.direction[this.facing]['faceDirection']; 
  if (this.facing == 'up' || this.facing == 'down') {
    this.y += this.directioin[this.facing]['travelDirection'];
  } else {
    this.x += this.directioin[this.facing]['travelDirection'];
  }
}
*/