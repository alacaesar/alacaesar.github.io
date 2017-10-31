
// hello three

// Main vars
var master_raster = "assets/03.jpg",
	resolution = 20, 	// px width
	maxWidth = 100, 		// units
	depth = 50,
	factor = .7, 		// each plate (pixel) size relative to 1 unit.
	currentMousePos = { x: -1, y: -1 },
	_x, // x axis segments
	_y, // y axis segments
	/*
	slice = [
		["red", 0,30],		// red
		["orange", 30,45],	// orange
		["yellow", 45,65], 	// yellow
		["green", 65,165],	// green
		["cyan", 165, 185], // cyan
		["blue", 185, 250], // blue
		["purple", 260, 285],	// purple
		["pink", 285, 335], // pink
		["red", 335, 360]  // red
	],
	segments = {red:[], orange:[], yellow:[], green:[], cyan:[], blue:[], purple:[], pink:[]}
	*/
	shades = [],
	slice = [
		["red", 0,30],		// red
		["yellow", 30,65],	// yellow
		["green", 65,165],	// green
		["blue", 165, 265], // blue
		["red", 265, 325]  // red
	],
	segments = {red:[], yellow:[], green:[], blue:[]};

// update mouse position
$(document).ready(function(){
	$(document).mousemove(function(event) {
		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY - $(document).scrollTop();
    });
});

////////////////////////// Threejs setup

// scene and camera
var scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.z = 60;
	camera.updateMatrixWorld();

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 0);
document.body.appendChild( renderer.domElement );

// light
var light = new THREE.HemisphereLight( 0xf2f2f2, 0xffffff, 1 );
scene.add( light );

// STATS
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
stats.domElement.style.right = '0px';
stats.domElement.style.zIndex = 100;
document.body.appendChild( stats.domElement );

////////////////////////// Effects
/*
// postprocessing
composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
dotScreenEffect.uniforms[ 'scale' ].value = 4;
//composer.addPass( dotScreenEffect );

var rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
rgbEffect.uniforms[ 'amount' ].value = 0.0015;
rgbEffect.renderToScreen = true;
composer.addPass( rgbEffect );
*/

var group = new THREE.Object3D();

// The magic
var Raster = {
	init:function( url ){
		var _this = this;
			e = new Image;
			e.onload = function(){

				_x = Math.round(e.width/resolution),
				_y = Math.round(e.height/resolution);

				var width = Math.floor(e.width/_x),
					height = Math.floor(e.height/_y),
					j = 0;

					console.log(e.width, _x, _y);

				for(var i=0; i<_x*_y; ++i)
				{
					if( i % _x == 0 && i > 0 ) j++;

					var c = document.createElement("canvas");
						c.width = width;
						c.height = height;
						con = c.getContext("2d");

						//con.drawImage(e, x*width, y*height, width, height, 0, 0, width, height);
						con.drawImage(e, width*(i-(j*_x)), j*height, width, height, 0, 0, width, height);

						con.fillText((i-(j*_x))+"-"+j,5,10);

						var av = averageColor(c, width, height);

						var color = tinycolor({r:av[0], g:av[1], b:av[2]});

						var hex = color.toHex();


						//console.log(av, Raster.rgbToHex(av[0], av[1], av[2]) );
						/*
						$(".av").append('<div style="display:inline-block; width:'+width+
										'px; height:'+height+'px; background:#'+hex+';">'+
										 av[0]+'<br/>'+av[1]+'<br/>'+av[2]+'</div>');

						document.getElementsByTagName("body")[0].appendChild(c);
						*/

						shades.push({id:i, obj:null, hex:color.toHex(), hsl:color.toHsl(), rgb:av, position:{x:width*(i-(j*_x)), y:j*height, z:0}, place:{a:(i-(j*_x)), b:j}});
				}

				_this.process();
				_this.colors();

				_this.orbs();

			}
			e.src = url;
	},
	colors:function(){
		var _this = this;

		shades.sort(function(a, b) {
			return a.hsl.h - b.hsl.h;
		});

		var hue = 0;
		var z = 10;

		for(var i=0; i<shades.length; ++i)
		{
			var s = shades[i];

			if (s.hsl.h < slice[0][2] || s.hsl.h > slice[slice.length-1][1])
			{
				segments[slice[0][0]].push(s.i);
				s.color = slice[0][0];

				$(".sg tr td:eq("+0+")").append('<div style="display:inline-block; width:'+z+'px; height:'+z+'px; background:#'+shades[i].hex+';"></div>');
            }
			else
			{
				for( var j=1; j<slice.length-1; ++j)
				{
					if (s.hsl.h >= slice[j][1] && s.hsl.h < slice[j][2])
					{
						segments[slice[j][0]].push(s.i);
						s.color = slice[j][0];
						//z = 10 * j + 10;

						$(".sg tr td:eq("+j+")").append('<div style="display:inline-block; width:'+z+'px; height:'+z+'px; background:#'+shades[i].hex+';"></div>');
					}
				}
			}

		}


		console.log( ( segments.red.length/shades.length * 100).toFixed(1) );
		console.log( ( segments.yellow.length/shades.length * 100).toFixed(1) );
		console.log( ( segments.green.length/shades.length * 100).toFixed(1) );
		console.log( ( segments.blue.length/shades.length * 100).toFixed(1) );

		console.log( ( segments.red.length/shades.length * 100).toFixed(2) * .7 + 30 );
		console.log( ( segments.yellow.length/shades.length * 100).toFixed(2) * .7 + 30 );
		console.log( ( segments.green.length/shades.length * 100).toFixed(2) * .7 + 30 );
		console.log( ( segments.blue.length/shades.length * 100).toFixed(2) * .7 + 30 );

	},
	orbs: function(){

		var margin = 3,
			axis = 100,
			total = 0,
			ratios = [];

		for( var color in segments )
		{
			var k = segments[color].length / shades.length;

				if ( segments[color].length > 0) {

					var m = k * .7 + .3;
						ratios.push({color:color, ratio: m});
						total += m;
				}
		}

		for ( var r in ratios ) {

			var radius = axis * ( ratios[r].ratio / total );
				ratios[r].radius = radius;
        }

		console.log( ratios[0] );


		this.animate = function(){

			console.log("animate");

			var epicenter = -axis * .5;

			TweenMax.to(camera.position, 1, {z:100, ease: Cubic.easeInOut, onComplete:function(){

			for(var j=0; j<ratios.length; ++j)
			{
				epicenter += ratios[j].radius;
				console.log(ratios[j].color, ratios[j].radius, epicenter);

				for(var i=0; i<shades.length; ++i)
				{
					if (shades[i].color == ratios[j].color ) {

						var p = randomSpherePoint(epicenter,0,0, ratios[j].radius ,.3);

						var pX = p[0],
							pY = p[1],
							pZ = p[2];

						TweenMax.to(shades[i].obj.position, Math.random() * .5 + 1.5, {x:pX, y:pY, z:pZ, ease: Back.easeInOut});

					}
				}

			}
		}});
		}

		this.bringForth = function( val ){

			console.log("bringforth", val)

			for(var i=0; i<shades.length; ++i)
			{
				var color = tinycolor("#"+shades[i].hex),
						value;

				switch (val) {
					case "brightness":
						value = ( color.getBrightness() / 255 );
					break;
					case "red":
						value = ( shades[i].rgb[0] / 255 );
					break;
					case "green":
						value = ( shades[i].rgb[1] / 255 );
					break;
					case "blue":
						value = ( shades[i].rgb[2] / 255 );
					break;
        }

				TweenMax.to(camera.position, 1, {z:100, ease: Cubic.easeInOut});
				TweenMax.to(shades[i].obj.position, Math.random() * .5 + 1.5, {z: value * (maxWidth / 2), ease: Back.easeInOut });

			}

		}

		//this.bringForth("brightness");

	},
	process:function(){
		var _this = this,
			planeSize = maxWidth / _x,
			maxHeight = planeSize * _y;

			var geo = new THREE.PlaneGeometry( maxWidth, maxHeight );
			var mat = new THREE.MeshLambertMaterial({color:0xFF0000});
			var pla = new THREE.Mesh( geo, mat );
				pla.position.set(-maxWidth*.5, -maxHeight*.5);

			scene.add(pla);

		for(var i=0; i<shades.length; ++i)
		{
			var geometry = new THREE.PlaneGeometry( factor * planeSize, factor * planeSize );
			var material = new THREE.MeshLambertMaterial({ color: "#"+shades[i].hex });
			var plane = new THREE.Mesh( geometry, material );
				plane.material.side = THREE.DoubleSide;

				//console.log(shades[i].place)

				plane.position.set(maxWidth*.5 - shades[i].place.a * planeSize, maxHeight*.5 - shades[i].place.b * planeSize, 0 );
				//plane.position.set(- (_x*factor*planeSize) + shades[i].place.a * factor, (_y*factor*planeSize) - shades[i].place.b * factor, (shades[i].rgb[0] / 255) * 0 );

				shades[i].obj = plane;

				group.add( plane );
		}

		scene.add( group );

	}
}
Raster.init( master_raster );



////////////////////////// Render
var render = function () {
	requestAnimationFrame( render );

	group.rotation.y = (currentMousePos.x - (window.innerWidth * .5)) / (window.innerWidth * .5);
	group.rotation.x = (currentMousePos.y - (window.innerHeight * .5)) / (window.innerHeight * .5);
	//group.rotation.x += 0.001;
	//group.rotation.y += 0.001;
	//cube.position.z += 0.001;

	//group.rotation.x += .01;

	//camera.position.x = (currentMousePos.y - (window.innerHeight * .5)) / (window.innerHeight * .5);

	//camera.position.z = 8 - 5 * ( Math.abs(currentMousePos.y - (window.innerHeight * .5)) / (window.innerHeight * .5) );

	stats.update();
	renderer.render(scene, camera);
	//composer.render();
};
render();

////////////////////////// Interactions

function action( val ) {

	if(val != "")
	{
		Raster.bringForth(val);
	}
	else
	{

	var p,
			planeSize = maxWidth / _x,
			maxHeight = planeSize * _y;

	for(var i=0; i<shades.length; ++i)
	{
		var color = tinycolor("#"+shades[i].hex);

		switch (val) {
			case "test":{

				Raster.bringForth("brightness");

			}
			case "shades": {
				if (shades[i].color == "red") {
								p = randomSpherePoint(0,0,0,10+30 * ( segments.red.length/shades.length) ,.3);
						}
				else if ( shades[i].color == "yellow" ) {
								p = randomSpherePoint(30,0,0,10+30 * ( segments.yellow.length/shades.length) ,.3);
						}
				else if ( shades[i].color == "green" ) {
								p = randomSpherePoint(60,0,0,10+30 * ( segments.green.length/shades.length) ,.3);
						}else
				{
								p = randomSpherePoint(-60,0,0,10+30 * ( segments.blue.length/shades.length) ,.3);
				}
			}
				break;
			case "red": {

				p = [
						maxWidth*.5 - shades[i].place.a * planeSize,
						maxHeight*.5 - shades[i].place.b * planeSize,
						(shades[i].rgb[0] / 255) * depth
						];

			}
			break;
			case "green": {

				p = [
						maxWidth*.5 - shades[i].place.a * planeSize,
						maxHeight*.5 - shades[i].place.b * planeSize,
						(shades[i].rgb[1] / 255) * depth
						];

			}
			break;
			case "blue": {

				p = [
						maxWidth*.5 - shades[i].place.a * planeSize,
						maxHeight*.5 - shades[i].place.b * planeSize,
						(shades[i].rgb[2] / 255) * depth
						];

			}
				break;
			case "brightness": {

				p = [
						maxWidth*.5 - shades[i].place.a * planeSize,
						maxHeight*.5 - shades[i].place.b * planeSize,
						(color.getBrightness() / 255) * depth
					 	];

			}
				break;
			default: {

				p = [
						maxWidth*.5 - shades[i].place.a * planeSize,
						maxHeight*.5 - shades[i].place.b * planeSize,
						0
					 	];

			}

		}

		var pX = p[0],
				pY = p[1],
				pZ = p[2];


		TweenMax.to(camera.position, 1, {z:100, ease: Cubic.easeInOut});
		TweenMax.to(shades[i].obj.position, Math.random() * .5 + 1.5, {x:pX, y:pY, z:pZ, ease: Back.easeInOut});

	}
	}
}

////////////////////////// Utils
// average color of an area
function averageColor(context, w, h){
	var res = 10,
		s = 0,
		data = [0, 0, 0];

	var a = document.createElement("canvas");
		a.width = res;
		a.height = res;
		a = a.getContext("2d");
		a.drawImage(context, 0, 0, w, h, 0, 0, res, res);

	for(var i=0; i< Math.pow(res, 2); ++i)
	{
		if( i % res == 0 && i > 0 ) s++;
		var	point = a.getImageData(s, i-(s*res), res, res).data
			data[0] += point[0];
			data[1] += point[1];
			data[2] += point[2];
	}
	data[0] = Math.round( data[0] * Math.pow(res, -2) );
	data[1] = Math.round( data[1] * Math.pow(res, -2) );
	data[2] = Math.round( data[2] * Math.pow(res, -2) );
	return data;
}

// random point in a sphere
function randomSpherePoint(x0,y0,z0,radius,peel){
	var pl = peel || 0;
		rad = (Math.random() * pl + (1-pl) ) * radius,
		u = Math.random(),
		v = Math.random(),
		theta = 2 * Math.PI * u,
		phi = Math.acos(2 * v - 1),
		x = x0 + (rad * Math.sin(phi) * Math.cos(theta)),
		y = y0 + (rad * Math.sin(phi) * Math.sin(theta)),
		z = z0 + (rad * Math.cos(phi));
	return [x,y,z];
}

// draw text on canvas
function makeSprite(args) {
    //
}

/*
	var canvas1 = document.createElement('canvas');
		canvas1.width = 300;
		canvas1.height = 200;
	var context1 = canvas1.getContext('2d');
	context1.rect(0,0,300,200);
	context1.fillStyle = "red";
	context1.fill();
	context1.font = "40px Maison Neue";
	context1.fillStyle = "rgba(255,255,255,.8)";
    context1.fillText('Shades', 0, 50);

	document.body.appendChild(canvas1);

	// canvas contents will be used for a texture
	var texture1 = new THREE.Texture(canvas1)
	texture1.needsUpdate = true;

    var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
	material1.needsUpdate = true;
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 2),
        material1
      );
	mesh1.position.set(0,0,0);
	scene.add( mesh1 );

/*
var interval = 0;

setInterval(function(){

	TweenMax.to(rgbEffect.uniforms[ 'amount' ], .2, {value: 0.0001, ease: Back.easeIn, onComplete:function(){

		TweenMax.to(rgbEffect.uniforms[ 'amount' ], .2, {value: 0.0555, ease: Back.easeIn, onComplete:function(){

			rgbEffect.uniforms[ 'amount' ].value = 0.0015;

		}});

	}});

}, 2000);
*/


/*
// create the particle variables
var particleCount = 1800,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 2
    });

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 500 - 250,
      pY = Math.random() * 500 - 250,
      pZ = Math.random() * 500 - 250,
      particle = new THREE.Vector3(pX, pY, pZ);

  // add it to the geometry
  particles.vertices.push(particle);
}

// create the particle system
var particleSystem = new THREE.Points(
    particles,
    pMaterial);

// add it to the scene
scene.add(particleSystem);

camera.position.z = 0;

var render = function () {
	requestAnimationFrame( render );

	camera.position.z += .1;
	camera.position.x += .05;
	//camera.rotation.x += .001;
	particleSystem.rotation.y += 0.001;

	renderer.render(scene, camera);
};

render();
*/
