// PAPERJS CODE |
//							V

var grow = []; // this array will be explained troughout the code.

// This function takes several variables and draws a single leaf.
// point - the point of the leaf base
// angle - angle of the leaf
// size - a multiplier value used to calculate the leaf size.
// hue - hue value to decide a color to start with
function leaf(point, angle, size, hue) {
  var a = angle;
  var path = new Path();

  var p = [], // an array to hold the points that form the leaf
    r1 = Math.random(); // we use these two random values to make every leaf
  r2 = Math.random(); // look unique from the others and yet bound by certain limits

  // the math of forming the leaf shape.
  p[0] = point;
  p[1] = point + new Point(Math.cos(toRadians(a + 10 + (20 * r1))) * (size + 20 * (r2 - .5)),
    Math.sin(toRadians(a + 10 + (20 * r1))) * (size + 20 * (r2 - .5)));
  p[2] = point + new Point(Math.cos(toRadians(a)) * size, Math.sin(toRadians(a)) * size);
  p[3] = point + new Point(Math.cos(toRadians(a - 10 - (20 * r1))) * (size + 20 * (r2 - .5)),
    Math.sin(toRadians(a - 10 - (20 * r1))) * (size + 20 * (r2 - .5)));

  // creating a gradient to be applied to the path.
  // starting with a color with slight random shift from
  // our hue value and ending with the hue value.
  var gradient = new Gradient([{
    hue: hue - (Math.random() * 50),
    saturation: 1,
    brightness: 1
  }, {
    hue: hue,
    saturation: 1,
    brightness: 1
  }]);
  var gradientColor = new Color(gradient, point, p[2]);

  // make gradient fill and drop opacity
  path.fillColor = gradientColor;
  path.opacity = .5;

  // store the points array on the path object to use later for animation
  path.p = p;

  // for now add points all the points to 0,0
  for (var i = 0; i < p.length; ++i)
    path.add(point);

  path.closePath();
  path.smooth();

  // add this path to grow array to be animated using the "onFrame" functions
  // and remove it from the array after 1 second.
  grow.push(path);
  setTimeout(function() {
    grow.splice(0, 1);
  }, 1000);
}

// This function creates a flower on the assigned point
function seedFlower(point) {
  var n = 10 + Math.round(Math.random() * 7); // number of leaves random between 10 to 17
  var s = Math.round(360 / n); // slice of the 360 degree to put each leaf in
  var h = Math.random() * 360; // hue value to calculate color
  var z = Math.random() * 70 + 40; // random value to calculate size
  // NOT: all these values are adjustable, play around with them (:

  // call to draw the leaves
  for (var i = 0; i < n; ++i) {
    leaf(point, (i * s) + (Math.random() * s), z * .8 + (Math.random() * z * .2), h);
  }
}

// Trying to use the "onFrame" function to animate the leaves
// rather than using a third party tween library
function onFrame(event) {
  // while there are paths in the "grow" array make them grow
  if (grow.length > 0) {

    for (var i = 0; i < grow.length; ++i) {
      for (var j = 0; j < grow[i].segments.length; ++j) {
        // simple ease math
        // move the path points from 0,0 to stored destination points
        vector = grow[i].p[j] - grow[i].segments[j].point;
        grow[i].segments[j].point += vector / (10 + Math.random() * 50);

        // call smooth again to recalculate and keep the shape nice
        grow[i].smooth();
      }
    }
  }
}

// simple function to convert degrees to radians
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

// seed a flower whenever the stage is clicked
function onMouseUp(event) {
  seedFlower(event.point);
}

// NEXT: you may try creating different "leaf" functions with different shapes
//		 to make more exotic flowers. Also reverse the "grow" animation to
//		 make the flowers wither after certain time.
