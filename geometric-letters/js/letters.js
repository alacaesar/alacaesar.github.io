
var velocity = {x:5, y:5},
    disturbance = .03,
    num = 50,
    letterspacing = 10,
    fontsize = 50,
    debug = false,
    hue = 240; //blue
    
    canDelete = true;
    
var particles = [];
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var letters = chars.split("");
var sentence = [];

var size = 50;

var Shape = function(type, color){
    
    var path = new Path();
    
    switch (type) {
        case 0: // bigTriangle
            path.segments = [[size * .5, 0], [size, size], [0, size]];
            break;
        case 1: // smallTriangle
            path.segments = [[ size * .25, 0], [size * .5, size * .5], [0, size * .5]];
            break;
        case 2: // smallFlatTriangle
            path.segments = [[ size * .25, 0], [size * .25, size * .5], [0, size * .25]];
            break;
        case 3: // rightTriangle
            path.segments = [[0, 0], [size * .5, 0], [0, size * .5]];
            break;
        case 4: // rectangle
            path.segments = [[0, 0], [size * .5, 0], [size * .5, size], [0, size]];
            break;
        case 5: // extendedHalfCircle
            path.segments = [[[size * .5,0], null, [- size * .25, 0]], [[0, size * .5], [0, - size * .25], [0, size * .25]], [[size * .5, size], [- size * .25, 0], null], [size * .75, size], [size * .75, 0]];
            break;
        case 6: // halfCircle
            path.segments = [[[0, size * .5], null, [0, - size * .25]], [[size * .5, 0], [- size * .25, 0], [ size * .25, 0]], [[size, size * .5], [0, - size * .25]]];
            break;
        case 7: // largeCircle
            path = new Path.Circle({center: [size * .5, size * .5], radius: size * .5});
            break;
        case 8: // mediumCircle
            path = new Path.Circle({center: [size * .3, size * .3], radius: size * .3});
            break;
        case 9: //smallCircle
            path = new Path.Circle({center: [size * .2, size * .2], radius: size * .2});
            break;
        case 10: // bigRightTriangle
            path.segments = [[0, 0], [0, size], [size, size]];
            break;
        case 11: // square
            path.segments = [[0, 0], [size * .5, 0], [size * .5, size * .5], [0, size * .5]];
            break;
    }
    
    path.fillColor = {hue:color, brightness:1, saturation:1};
    //path.fillColor = color;
    path.opacity = .5;
    
    return new Symbol(path);
};

var cast = {
    a:{parts:[{t:0, x:0, y:0, a:0}, {t:1, x:.5, y:.5, a:0}], width:1},
    b:{parts:[{t:4, x:0, y:0, a:0}, {t:9, x:.3, y:0, a:0}, {t:8, x:.2, y:.4, a:0}], width:.8},
    c:{parts:[{t:5, x:0, y:0, a:0}], width:.75},
    d:{parts:[{t:4, x:0, y:0, a:0}, {t:5, x:1, y:1, a:180}], width:1},
    e:{parts:[{t:4, x:0, y:0, a:0}, {t:3, x:.25, y:0, a:0}, {t:3, x:.25, y:1, a:-90}, {t:2, x:.5, y:.25, a:0}], width:.75},
    f:{parts:[{t:4, x:0, y:0, a:0}, {t:3, x:.25, y:0, a:0}, {t:2, x:.5, y:.25, a:0}], width:.75},
    g:{parts:[{t:5, x:0, y:0, a:0}, {t:3, x:1, y:1, a:180}], width:1},
    h:{parts:[{t:4, x:0, y:0, a:0}, {t:4, x:.25, y:0, a:0}], width:.75},
    i:{parts:[{t:4, x:0, y:0, a:0}], width:.5},
    j:{parts:[{t:4, x:.25, y:0, a:0}, {t:3, x:.5, y:1, a:180}], width:.75},
    k:{parts:[{t:4, x:0, y:0, a:0}, {t:3, x:.25, y:0, a:0}, {t:3, x:.25, y:1, a:-90}], width:.75},
    l:{parts:[{t:4, x:0, y:0, a:0}, {t:3, x:.25, y:1, a:-90}], width:.75},
    m:{parts:[{t:10, x:0, y:0, a:0}, {t:10, x:0, y:1, a:-90}], width:1},
    n:{parts:[{t:4, x:0, y:0, a:0}, {t:10, x:1, y:1, a:180}], width:1},
    o:{parts:[{t:7, x:0, y:0, a:0}], width:1},
    p:{parts:[{t:4, x:0, y:0, a:0}, {t:8, x:.2, y:0, a:0}], width:.8},
    q:{parts:[{t:7, x:0, y:0, a:0  }, {t:2, x:1, y:.75, a:90}], width:1},
    r:{parts:[{t:4, x:0, y:0, a:0}, {t:8, x:.2, y:0, a:0}, {t:3, x:.5, y:1, a:-90}], width:1},
    s:{parts:[{t:6, x:.2, y:0, a:0}, {t:6, x:1, y:1, a:180}], width:1.2},
    t:{parts:[{t:4, x:.25, y:0, a:0}, {t:4, x:0, y:.5, a:-90}], width:1},
    u:{parts:[{t:5, x:0, y:1, a:-90}, {t:4, x:0, y:.5, a:-90}], width:1},
    v:{parts:[{t:0, x:1, y:1, a:180}, {t:1, x:1, y:.5, a:180}], width:1},
    w:{parts:[{t:0, x:1, y:1, a:180}, {t:0, x:1.5, y:1, a:180}], width:1.5},
    x:{parts:[{t:0, x:1, y:1, a:180}, {t:0, x:0, y:0, a:0}], width:1},
    y:{parts:[{t:0, x:1, y:1, a:180}, {t:3, x:.5, y:1, a:180}], width:1},
    z:{parts:[{t:4, x:.25, y:0, a:0}, {t:3, x:.5, y:0, a:90}, {t:3, x:.5, y:1, a:-90}], width:1.1},
    1:{parts:[{t:4, x:.25, y:0, a:0}, {t:2, x:.5, y:0, a:90}], width:.75},
    2:{parts:[{t:10, x:1, y:1, a:180}, {t:11, x:.5, y:.5, a:0}], width:1},
    3:{parts:[{t:5, x:1, y:1, a:180}, {t:11, x:0, y:.25, a:0}], width:1},
    4:{parts:[{t:10, x:0, y:1, a:-90}, {t:11, x:.5, y:.5, a:0}], width:1},
    5:{parts:[{t:10, x:0, y:1, a:-90}, {t:4, x:.5, y:.5, a:-90}], width:1.5},
    6:{parts:[{t:3, x:.25, y:0, a:0}, {t:8, x:0, y:.4, a:0}], width:.75},
    7:{parts:[{t:10, x:1, y:1, a:180}], width:1},
    8:{parts:[{t:9, x:.1, y:0, a:0}, {t:8, x:0, y:.4, a:0}], width:.6},
    9:{parts:[{t:3, x:.5, y:1, a:180}, {t:8, x:.15, y:0, a:0}], width:.75},
    0:{parts:[{t:6, x:0, y:1, a:-90}, {t:7, x:0, y:0, a:0}], width:1},
    space:{parts:[], width:.5}
}

var colors = ["#FEF7A9", "#F17B89", "#6D0D6A", "#928DC3"];

function makeShape( pos, type ) {
    
    //var p = Shape( type, colors[Math.round(Math.random() * colors.length)] );
    var p = Shape( type, Math.random() > .5 ? 240 : 360 );
    var k = p.place( pos );
        k.pivot = k.globalToLocal(k.bounds.topLeft);
        k.rotation = Math.random() * 360;
        k.velocity = {x:Math.random() * velocity.x, y:Math.random() * velocity.y};
        k._type = ""+ type;
            
    return k;
}

function init(){
    reset();
    //var indicator = new Path.Circle({center:[200, 200], radius:1, fillColor:"black"});
    
    for( var i=0; i<num; ++i)
    {
        var pos = view.size * Point.random(),
            type = Math.round( Math.random() * 11 );
            
        var k = makeShape( pos, type );
        particles.push( k );
    }
}
init();

this.refresh = function( args ){
    
    console.log( args );
    
    disturbance = args["disturbance"];
    num = args["count"];
    hue = args["hue"];
    letterspacing = args["letterspacing"];
    fontsize = args["size"];
    velocity.x = args["velocityx"];
    velocity.y = args["velocityy"];
    debug = args["debug"];
    
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

var maxWidth = 600;
var lineWidth = 0;
var lineNumber = 0;
var _con = 0;

function alignGeometrySentence() {
    
    var w = sentence.length * letterspacing,
        s = new Point(150, 200);
    
    for( var i=0; i<sentence.length; ++i)
    {
        for(var j=0; j<sentence[i].children.length; ++j)
        {
            TweenMax.to(sentence[i].children[j].position, 2, {x: s.x + cast[sentence[i].type].parts[j].x * size + lineWidth + letterspacing * (i-_con), y: s.y + cast[sentence[i].type].parts[j].y * size + lineNumber * (size * 1.5), ease: Back.easeOut});
            TweenMax.to(sentence[i].children[j], 2.5, {rotation: cast[sentence[i].type].parts[j].a, ease: Back.easeOut});
        }
        x++;
        
        lineWidth += sentence[i].width * size;
        if ( lineWidth > maxWidth )
        {
            lineWidth = 0;
            lineNumber++;
            _con = i+1;
        }
    }
    
    lineWidth = 0;
    lineNumber = 0;
    _con = 0;
}

function type( a ) {
        var _letterTemplate = cast[a.toLowerCase()],
            _letter = {type:a.toLowerCase(), children:[], width:_letterTemplate.width};
        
        if (particles.length > 0) {
            
            for( j in _letterTemplate.parts )
            {
                for( var i=0; i<particles.length; ++i)
                {
                    if ( particles[i]._type == _letterTemplate.parts[j].t) {
                        
                        _letter.children.push( particles[i] );
                        particles.splice(i, 1);
                        break;
                    }
                    
                    if ( i == particles.length-1 ) {
                        
                        var p = makeShape( view.size * Point.random(), _letterTemplate.parts[j].t );
                            _letter.children.push( p );
                        
                    }
                }
            }
            
            sentence.push(_letter);
            alignGeometrySentence();
            
        }
}

this.input = function(a){
    if(a === "delete")
    {
        if (sentence.length > 0 && canDelete)
        {
            item = sentence[sentence.length-1];
            canDelete = false;
            
            if (item.type === "space")
            {
                sentence.pop();
                canDelete = true;
            }
            else
            {
                var n = item.children.length+1;
                while (n--)
                {
                    
                    item.children[n-1].rotation = Math.random() * 180 - 90;
                    particles.push( item.children[n-1] );
                    item.children.pop();
                    
                    if (n-1 == 0) {
                      sentence.pop();
                      canDelete = true;
                    }
                }
            }
        }
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
           // TweenMax.to(sentence[i].fillColor, 2, {saturation:1, brightness:0, ease: Linear.easeOut});
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
        
        if (item.type === "space")
        {
            sentence.pop();
            clearAll();
        }
        else
        {
            //TweenMax.to(item.fillColor, 1, {saturation:1, brightness:1, ease: Linear.easeOut});
            var n = item.children.length+1;
            
            while (n--)
            {
                item.children[n-1].rotation = Math.random() * 180 - 90;
                particles.push( item.children[n-1] );
                item.children.pop();
                
                if (n-1 == 0) {
                  sentence.pop();
                  if (sentence.length > 0) clearAll();
                }
            }
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