
var drag = .80;
var maxSpeed = 10;
var rest = 50;
var charge = 1360;
var gravity = 000;
var k = charge/(Math.pow(rest,3));

var wallCharge = charge * 3;
var canvas;
var ctx;
var size = 16;

function rgb(){


  var r = Math.floor(Math.random() * 360);

  return "hsl("+r+", 100%, 75%)";
}

function limit(x,a){
  if(x < -a) return -a;
  if(x > a) return a;
  return x;
}

class Person{

  constructor(x, y, color){
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = size;

    this.friends = [];
    this.dx=0;
    this.dy=0;





  }

  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  addFriend(x){
    if(!this.isFriend(x)){
      this.friends.push(x);
      x.addFriend(this);
    }

  }

  isFriend(p){
    return this.friends.indexOf(p) > -1;
  }
  distance(x, y){
    var displacementX = this.x - x;
    var displacementY = this.y - y;

    return Math.sqrt(displacementX*displacementX + displacementY*displacementY);

  }

  interact(p){

    if(p == this) return;

    var displacementX = this.x - p.x;
    var displacementY = this.y - p.y;

    var distance = Math.sqrt(displacementX*displacementX + displacementY*displacementY);
    if(distance < 1){

      var angle = Math.random()*2*Math.PI;

      displacementX = Math.cos(angle);
      displacementY = Math.sin(angle);

      distance = 1;
    }

    var unitDisplacementX = displacementX/distance;
    var unitDisplacementY = displacementY/distance;

    var repulsiveForce = charge /(distance * distance);

    this.dx += unitDisplacementX * repulsiveForce;
    this.dy += unitDisplacementY * repulsiveForce;

    if(this.isFriend(p)){
      var attractiveForce = -distance * k;


      this.dx -= k*displacementX;
      this.dy -= k*displacementY;
    }

  }

  gravity(){
    var displacementX = this.x - canvas.width/2;
    var displacementY = this.y - canvas.height/2;

    var distance = Math.sqrt(displacementX*displacementX + displacementY*displacementY);
    if(distance > 100){
      var unitDisplacementX = displacementX/distance;
      var unitDisplacementY = displacementY/distance;

      var repulsiveForce = gravity /(distance * distance);

      this.dx -= unitDisplacementX * repulsiveForce;
      this.dy -= unitDisplacementY * repulsiveForce;

    }
  }

  leftWall(){
    var displacementX = this.x - 0;
    var displacementY = 0;

    var distance = Math.sqrt(displacementX*displacementX + displacementY*displacementY);
    if(distance < 1){

      var angle = Math.random()*2*Math.PI;

      displacementX = Math.cos(angle);
      displacementY = Math.sin(angle);


      distance = 1;
    }

    var unitDisplacementX = displacementX/distance;
    var unitDisplacementY = displacementY/distance;

    var repulsiveForce = wallCharge /(distance * distance);

    this.dx += unitDisplacementX * repulsiveForce;
    this.dy += unitDisplacementY * repulsiveForce;
  }

  rightWall(){
    var displacementX = this.x - canvas.width;
    var displacementY = 0;

    var distance = Math.sqrt(displacementX*displacementX + displacementY*displacementY);
    if(distance < 1){

      var angle = Math.random()*2*Math.PI;

      displacementX = Math.cos(angle);
      displacementY = Math.sin(angle);

      distance = 1;
    }

    var unitDisplacementX = displacementX/distance;
    var unitDisplacementY = displacementY/distance;

    var repulsiveForce = wallCharge /(distance * distance);

    this.dx += unitDisplacementX * repulsiveForce;
    this.dy += unitDisplacementY * repulsiveForce;
  }

  topWall(){
    var displacementX = 0;
    var displacementY = -canvas.height + this.y;

    var distance = Math.sqrt(displacementX*displacementX + displacementY*displacementY);
    if(distance < 1){

      var angle = Math.random()*2*Math.PI;

      displacementX = Math.cos(angle);
      displacementY = Math.sin(angle);


      distance = 1;
    }

    var unitDisplacementX = displacementX/distance;
    var unitDisplacementY = displacementY/distance;

    var repulsiveForce = wallCharge /(distance * distance);

    this.dx += unitDisplacementX * repulsiveForce;
    this.dy += unitDisplacementY * repulsiveForce;
  }
  bottomWall(){
    var displacementX = 0;
    var displacementY = 0 + this.y;

    var distance = Math.sqrt(displacementX*displacementX + displacementY*displacementY);
    if(distance < 1){

      var angle = Math.random()*2*Math.PI;

      displacementX = Math.cos(angle);
      displacementY = Math.sin(angle);


      distance = 1;
    }

    var unitDisplacementX = displacementX/distance;
    var unitDisplacementY = displacementY/distance;

    var repulsiveForce = wallCharge /(distance * distance);

    this.dx += unitDisplacementX * repulsiveForce;
    this.dy += unitDisplacementY * repulsiveForce;
  }

  step(){
    this.gravity();
    this.leftWall();
    this.rightWall();
    this.topWall();
    this.bottomWall();

    this.dx = limit(this.dx, maxSpeed);
    this.dy = limit(this.dy, maxSpeed);
    this.x += this.dx;
    this.y += this.dy;
    this.x = Math.max(1, this.x);
    this.x = Math.min(canvas.width-1, this.x);

    this.y = Math.max(1, this.y);
    this.y = Math.min(canvas.height-1, this.y);
    this.dx *=drag;
    this.dy *=drag;
  }

}



class PeopleHandler{


  constructor(num, chance){
    this.people = [];

    this.clicked = false;

    this.clickee = null;
    this.clickX = 0;
    this.clickY = 0;

    for(var i = 0; i < num; i ++){
      this.people.push(new Person(canvas.width/2, canvas.height/2, rgb()));
    }
    for(var i = 0; i < num; i ++)
      for(var j = 0; j < num; j ++)
        if(i!=j && Math.random() < chance)
          this.people[i].addFriend(this.people[j]);
    this.people = this.people.filter(function( obj ) {
      return obj.friends.length !== 0;
    });
  }

  addPerson(person){
    this.people.push(person);
  }

  click(x,y){
    for(var j = 0; j < this.people.length; j++){

      if(this.people[j].distance(x,y)< this.people[j].radius){
        this.clicked = true;
        this.clickee = this.people[j];
        this.clickX = x;
        this.clickY = y;
      }
    }
  }

  step(){
    for (var i = 0; i < this.people.length; i++){
      for(var j = 0; j < this.people.length; j++){

        this.people[i].interact(this.people[j]);
      }
      this.people[i].step();
    }
    if(this.clicked){
      this.clickee.x = this.clickX;
      this.clickee.y = this.clickY;
    }
  }

  draw(ctx){
    for (var i = 0; i < this.people.length; i++){
      for(var j = 0; j < this.people.length; j++){
        var p1 = this.people[i];
        var p2 = this.people[j];
        if(p1.isFriend(p2)){
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.closePath();

        }
      }

    }
    for (var i = 0; i < this.people.length; i++){
        this.people[i].draw(ctx)
    }

  }




}


canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
if (canvas.width < canvas.height) {
  size = 8;
}
ctx = canvas.getContext("2d");
console.log(canvas.width);
var gaurav = new Person(canvas.width/2, canvas.height/2, "purple");
var jake = new Person(canvas.width/2, canvas.height/2, "orange");
var timmy = new Person(canvas.width/2, canvas.height/2, "pink");
var patrick = new Person(canvas.width/2, canvas.height/2,"red");
var tyler = new Person(canvas.width/2, canvas.height/2, "blue");


var mosPosx = 0;
var mosPosy = 0;

gaurav.addFriend(patrick);
gaurav.addFriend(timmy);
gaurav.addFriend(tyler);

tyler.addFriend(jake);

timmy.addFriend(patrick);

var pH = new PeopleHandler(100 * canvas.width / 1920, .01 * 1920 /canvas.width);
/*
pH.addPerson(patrick);
pH.addPerson(timmy);
pH.addPerson(tyler);
pH.addPerson(jake);
pH.addPerson(gaurav);
*/

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  mosPosx = evt.clientX - rect.left;
  mosPosy = evt.clientY - rect.top;
  pH.clickX = mosPosx;
  pH.clickY = mosPosy;

}

function doDown(evt){
  var rect = canvas.getBoundingClientRect();
  mosPosx = evt.clientX - rect.left;
  mosPosy = evt.clientY - rect.top;
  pH.click(mosPosx,mosPosy);
}

function doUp(evt){
  var rect = canvas.getBoundingClientRect();
  mosPosx = evt.clientX - rect.left;
  mosPosy = evt.clientY - rect.top;
  pH.clicked = false;
}

function update(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    pH.step();
    pH.draw(ctx);


}
canvas.addEventListener('mousemove',getMousePos, false);
canvas.addEventListener('mousedown',doDown, false);
canvas.addEventListener('mouseup',doUp, false);
setInterval(update, 10);
