const LENGTH = 800, HEIGHT = 800, INCREMENT = 0.5, RADIUS = LENGTH * 2;
let PI_RATIO;
let intx, inty;

let barriers = [];

let img;
function preload() {
  img = loadImage("./assets/robot2.png");
}

function lightPoint(x = mouseX, y = mouseY) {
  stroke('white');
  strokeWeight(5);
  point(x,y);
  image(img,x-50,y-50, 100, 100)
}


function c(angle, r = RADIUS){
  return {
    x: r * cos(angle * PI_RATIO),
    y: r * sin(angle * PI_RATIO),
  }
}

function laserPoint(x, y) {
  stroke('red');
  strokeWeight(8);
  point(x,y)
  stroke('#2b0201');
  strokeWeight(2);
}

function lightRays() {
  stroke('#2b0201');
  strokeWeight(2);
  for(let i = 0; i < 360; i += INCREMENT) {
    let { x, y } = c(i);
    pointOfColision = colide(mouseX, mouseY, x + mouseX, y + mouseY);
    laserPoint(pointOfColision.intx, pointOfColision.inty)
    // if(!pointOfColision)
    //   line(mouseX, mouseY, x + mouseX, y + mouseY);
    // else
    //   line(mouseX, mouseY, pointOfColision.intx, pointOfColision.inty);
  }
}

function colide(x1, y1, x2, y2) {
  let pocs = [], d = 0; // point of colision
  barriers.forEach(barrier => {
    let { x, y, w, h } = barrier;
    if(intersectionPt(x1, x2, x, x + w, y1, y2, y, y)) {
      d = dist(x1, y1, intx, inty);
      pocs.push({ intx, inty, d });
    }
    if(intersectionPt(x1, x2, x, x + w, y1, y2, y + h, y + h)){
      d = dist(x1, y1, intx, inty);
      pocs.push({ intx, inty, d });
    }
    if(intersectionPt(x1, x2, x, x, y1, y2, y, y + h)){
      d = dist(x1, y1, intx, inty);
      pocs.push({ intx, inty, d });
    }
    if(intersectionPt(x1, x2, x + w, x + w, y1, y2, y, y + h)){
      d = dist(x1, y1, intx, inty);
      pocs.push({ intx, inty, d });
    }
  });
  return pocs.length == 0 ? false : pocs.sort((a, b) => a.d - b.d)[0];
}

function rectBarrier(x = 30, y = 20, w = 55, h = 55) {
  stroke('grey');
  strokeWeight(1);
  fill(0);
  rect(x, y, w, h);
  barriers.push({x, y, w, h})
}

function darkness() {
  background(10);
}


function setup() {
  createCanvas(LENGTH, HEIGHT);
  PI_RATIO = PI / 180;
}

function draw() {
  darkness();
  lightPoint();
  lightRays();
  barriers = [];
  rectBarrier();
  rectBarrier(20, 350, 200, 30);
  rectBarrier(300, 500, 100, 100);
  rectBarrier(600, 100, 1, 400);
}


//Code heavily taken from Example Code and Explanations by Paul Bourke at http://paulbourke.net/geometry/pointlineplane/
//
//Function to test for intersections between line segments:
function intersectionPt(x1,x2,x3,x4,y1,y2,y3,y4){

  var uA,uB;
  var den,numA,numB;

  den  = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1);
  numA = (x4-x3) * (y1-y3) - (y4-y3) * (x1-x3);
  numB = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);

  //Coincident? - If true, displays intersection in center of line segment
   if (abs(numA) == 0 && abs(numB) == 0 && abs(den) == 0) {
      intx = (x1 + x2) / 2;
      inty = (y1 + y2) / 2;
      return(true);
   }

   //Parallel? - No intersection
   if (abs(den) == 0) {
      intx = 0;
      inty = 0;
      return(false);
   }

   //Intersection?
   uA = numA / den;
   uB = numB / den;

   //If both lie w/in the range of 0 to 1 then the intersection point is within both line segments.
   if (uA < 0 || uA > 1 || uB < 0 || uB > 1) {
      intx = 0;
      inty = 0;
      return(false);
   }
   intx = x1 + uA * (x2 - x1);
   inty = y1 + uA * (y2 - y1);
   return(true);
}
