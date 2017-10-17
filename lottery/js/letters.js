
var velocity = {x:5, y:5},
    disturbance = .03,
    num = 20,
    letterspacing = 30,
    fontsize = 50,
    debug = false,
    hue = 240; //blue

    canDelete = true;

var particles = [];
var chars = "ĞİŞÖÜÇğışöüçABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var letters = chars.split("");
var sentence = [];

var symbolMaker = function(color, shape){
		var perimeter = new Path.Circle([0, 0], 30);
		perimeter.fillColor = "blue";
		perimeter.opacity = 0;
		var stick = new Path([[-20, 0], [20, 0]]);

		var core;

        switch (shape){
			case "circle": core = new Path.Circle({center:[0, 0], radius:15, fillColor:color});
			break;
			case "triangle": core = new Path({segments:[[-18,0], [18,0], [0, 24]], fillColor:color});
			break;
			case "stick": core = new Path({segments:[[-20,-5], [20,-5], [20, 5], [-20, 5]], fillColor:color});
			break;
			case "helix":
				var _xx = 20, _yy = 15;
				core = new Path({strokeColor:"red", strokeWidth: 10});
				for(var i=0; i<5; ++i){
					core.add(new Segment( new Point(i * _xx - 40, 0), [0, _yy * (i%2 ? -1 : 1)], [0, _yy * (i%2 ? 1 : -1)]));
				}
			break;

		};

        var group = new Group([perimeter, stick, core]);
		group.pivot = [0, 0];

		return new Symbol(group, true);

		group.remove();
}

function init(){

    reset();

    for( var i=0; i<num; ++i)
    {
        var pos = view.size * Point.random();
        var p = makeLetter( pos );
            p.opacity = 0;
		TweenMax.to(p, 1, {opacity:1, delay:2 * Math.random()});
        particles.push( p );
    }
}
//init();

function intro() {

    var	symbol1 = symbolMaker("#ACE7DA", "circle"),
            symbol2 = symbolMaker("#FCFF00", "triangle"),
            symbol3 = symbolMaker("#F9F1F1", "stick"),
            symbol4 = symbolMaker("#ff0000", "helix");

    for( var i=0; i<num; ++i)
    {
        var rand = Math.random();
        var pos = view.size * Point.random();

        if (rand < .3)
				var disc = symbol2.place(pos);
			else if (rand > .6 )
				var disc = symbol3.place(pos);
			else
				var disc = symbol1.place(pos);

            disc.rotation = Math.random() * 360;
            disc.velocity = {x:Math.random() * velocity.x, y:Math.random() * velocity.y};

        particles.push( disc );
    }
}
intro();

this.refresh = function( args ){
    /*
    console.log( args );

    disturbance = args["disturbance"];
    num = args["count"];
    hue = args["hue"];
    letterspacing = args["letterspacing"];
    fontsize = args["size"];
    velocity.x = args["velocityx"];
    velocity.y = args["velocityy"];
    debug = args["debug"];
    */
    init();
};

function reset(){
    particles.splice(0, particles.length);
    sentence.splice(0, sentence.length);
    project.activeLayer.removeChildren();
}

function onMouseUp() {
    num = Math.floor(Math.random() * 100);
    init();
}

function makeLetter( pos, character ) {

    var letter = character || letters[Math.floor(Math.random() * letters.length)];

    var p = new PointText( pos );
        p.fillColor = { hue: hue, saturation: 1, brightness: 1 }; //blue
        p.justification = "left";
        p.fontSize = fontsize;
        p.fontFamily = "Maison Neue";
        p.content = p._val = letter;
        p.pivot = [0, 0];
        p.rotation = p._rotation = Math.random() * 360;
        p.velocity = {x:Math.random() * velocity.x, y:Math.random() * velocity.y};
        p.selected = debug;
    return p;
}

function type( a ) {

    if (particles.length > 0) {
        for( var i=0; i<particles.length; ++i)
        {
            if ( particles[i]._val.toUpperCase() === a.toUpperCase() ) {

                sentence.push( particles[i] );
                particles.splice(i, 1);
                break;
            }

            if (i == particles.length-1) {

                var p = makeLetter( view.size * Point.random(), Math.random() > .5 ? a.toUpperCase() : a.toLowerCase() );
                sentence.push( p );

            }
        }
    }
    else
    {
        var p = makeLetter( view.size * Point.random(), Math.random() > .5 ? a.toUpperCase() : a.toLowerCase() );
        sentence.push( p );
    }

    alignSentence();
}

this.input = function(a){
        if(a === "delete")
        {
            if (sentence.length > 0 && canDelete)
            {
                item = sentence[sentence.length-1];
                canDelete = false;

                if (item._val === "space")
                {
                    sentence.pop();
                    alignSentence();
                    canDelete = true;
                }
                else
                {
                    TweenMax.to(item.fillColor, 1, {saturation:1, brightness:1, ease: Linear.easeOut});
                    TweenMax.to(item, .3, {rotation: Math.random() * 180 - 90, ease: Linear.easeInOut, onComplete:function(){
                            particles.push( item );
                            sentence.pop();
                            alignSentence();
                            canDelete = true;
                        }
                    });
                }
            }
        }
        else if (a === "space")
        {
            var p = {_val: "space"};
            sentence.push( p );
            canDelete = true;
        }
        else
        {
            type(a);
            canDelete = true;
        }
    };

this.clearAll = function(){ clearAll(); };


paper.install(window.paperscript);


var lineheight = 60;
var x = 0, y = 0, br = 0;

function alignSentence(){

    var w = sentence.length * letterspacing;
        s = view.center.x - w * .5;

    for( var i=0; i<sentence.length; ++i)
    {
        if (sentence[i]._val === "space") {
            if ( letterspacing * x > 300) {

                //y++;
                //x = 0;
                //br = i;

                //s = view.center.x - ( letterspacing * ( sentence.length - br ) ) * .5;

            }
        }
        else
        {
            TweenMax.to(sentence[i].position, 1, {x: s + letterspacing * x, y: view.center.y + lineheight * y, ease: Back.easeOut});
            TweenMax.to(sentence[i], 1.5, {rotation: 0, ease: Back.easeOut});
            TweenMax.to(sentence[i].fillColor, 2, {saturation:1, brightness:0, ease: Linear.easeOut});
        }
        x++;
    }

    x = 0;
    y = 0;
    br = 0;
}

function clearAll(){
    if (sentence.length > 0){
        item = sentence[sentence.length-1];

        if (item._val === "space")
        {
            sentence.pop();
            clearAll();
        }
        else
        {
            TweenMax.to(item.fillColor, 1, {saturation:1, brightness:1, ease: Linear.easeOut});

            item.rotation = Math.random() * 180 - 90;
            particles.push( item );
            sentence.pop();

            if (sentence.length > 0)
                clearAll();
        }
    }
}


function onFrame(event) {
    for (var i=0; i<particles.length; ++i) {

        if (particles[i].position.x > view.size.width || particles[i].position.x < 0) {
            particles[i].velocity.x *= -1;
        }

        if ( particles[i].position.y > view.size.height || particles[i].position.y < 0) {
            particles[i].velocity.y *= -1;
        }

        particles[i].position.x += Math.sin(particles[i].rotation) * particles[i].velocity.x;
        particles[i].position.y -= Math.cos(particles[i].rotation) * particles[i].velocity.y;

        if ( Math.random() < disturbance ) {
            particles[i].rotation += 1;
        }
    }
}
