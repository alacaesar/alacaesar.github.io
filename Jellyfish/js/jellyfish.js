/*
 *
 * Jellyfish Experiment
 * Alaa Alnuaimi
 * April 2017
 *
 */

var population = 15,
	fishes = [];

var Jellyfish = {
        make: function( p ){
			
			p = p || new Point(0, 0);
			
			// random numbers
				// belly buldge
			var b = Math.random() * .8 + .2,
				// vertical place of the buldge
				m = Math.random() * .6 + .2,
				// number of rings
				num = Math.round(Math.random() * 8 + 8),
				// max width of the head
				size = Math.random() * 20 + 30,
				// length of the tail
				length = length = 200 + 200 * Math.random(),
				// speed ratio
				speed = Math.random() * .5 + .5,
				// color range
				color = [
						  "Magenta",
						  "MediumPurple"
						  ];
			
			var fish = new Group({});
				fish._pos = p;
				fish.pivot = new Point(0, 0);
				fish.rings = [];
				fish._y = view.size.height;
				fish._r = speed;
				fish._h = length;
			
			// make the head
			function head(p){
                
                var symbol = new Symbol(new Path.Circle({center:[0,0], radius:size, strokeColor:color[0], strokeWidth:5}));
                var k = 0;
				for (var i=1; i<=num; ++i) {
                        
                        var ratio = 1- Math.pow(i-(num*m),2)/Math.pow(num*( i<num*m ? m : 1-m),2);
						
                        var rate = (1-b) + b * ratio;
                        var ring = symbol.place(p + [0, k]);
							ring.scale(rate, rate * .25);
							ring._y = k;
							ring._r = rate;
                        
						k += size * rate * .25;
						
						fish.rings.push(ring);
						fish.addChild(ring);
                }
            }
			
			// make the sting
			function sting( p ) {
                // pieces of the tail
				num =  Math.round(num*.5);
				
				var brain = new Path.Circle({center:p + [0, size * .5], radius:size * .25, fillColor:color[1]});
					brain.scale(.3, 1);
                var tail = new Path({strokeColor:color[1], strokeWidth:2, strokeCap:"round", pivot:[0, 0], selected:false});
                        
                for(var i=0; i<=num; ++i)
                {
                    tail.add(new Point( 0 , Math.pow(i,1.3)/Math.pow(num,1.3) * length + size * .5 ) + p );
                }
				
				fish.addChild(brain);
				fish.addChild(tail);
            }
			
			head( p );
			sting( p );
			
			return fish;
        }
};

function init() {
	
	for(var i=0; i<population; ++i)
	{
		var fish = Jellyfish.make();
			fish.position = new Point(view.size.width * Math.random(), /*view.size.height +*/ view.size.height * Math.random());
			
		fishes.push(fish);
	}
}
init();

function onFrame(event) {
	
	if(fishes.length > 0) {
		
		for(var f=0; f<fishes.length; ++f)
		{
			var fish = fishes[f];
			
			var vector = fish._y - fish.position.y;
			fish.position.y += vector / (30 * fish._r );
			
			fish.position.x += Math.sin(event.time * 5 + f);
			
			if ( fish.position.y - fish._y < 20) {
				fish._y -= 100;
			}
			else
			{
			
			//fish.position.y -= 1;
			
			if ( fish.position.y + fish._h < 0) {
				fish.position.y = view.size.height;
				fish.position.x = view.size.width * Math.random();
				fish._y = view.size.height - 100;
			}
			
			var factor = (Math.abs(fish.position.y - fish._y - 20)/100);
			
			// Loop through the segments of the path:
			
			for (var j=1; j<fish.lastChild.segments.length; ++j) {
				
				var sinus = Math.sin(event.time * 20 + j);
					
				var segment = fish.lastChild.segments[j];
					segment.point.x = sinus * (20*(j/(fish.rings.length * .5 ))) * factor + fish.position.x;
					fish.lastChild.smooth();
				
				for (var i = 1; i <fish.rings.length; i++) {
					
					var sinus = Math.sin(event.time * 7 + j);
				
					fish.rings[i].position.y = sinus * (i+1) + fish.position.y + fish.rings[i]._y;
				
				}	
			}
		}
		
    }
}
}