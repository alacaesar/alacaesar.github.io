
var	size = 800,
	res = 35,
	noise = 30,
	pattern = "diamond",
	
	j=0,
	k=0,
	h,
	v,
	x_shift,
	y_shift,
	dots = [],
	rw = 0,
	rh = 0,
	raster,
	layer = new Layer();

this.initDistortion = function(data){
	
	project.layers[0].removeChildren();
	
	size = data.size;
	res = data.resolution;
	noise = data.noise;
	pattern = data.pattern;
	
	dots.splice(0, dots.length);
	j = k = 0;
	
	proccessRaster();
}
this.v = view;
paper.install(window.paperscript);

function proccessRaster(){
	
	raster = rasterloader.clone();
	
	rw = raster.size.width;
	rh = raster.size.height;
	
	h = Math.floor(res*.5)+1,
        v = (h * rh) / rw;
	
	w = Math.round(size / h);
	
	x_shift = view.center.x - size * .5;
	y_shift = view.center.y - ((rh * size) / rw ) * .5;
	
	raster.size = new Size(h, v);
	
	project.layers[0].activate();
        
        draw();
}

function draw(){
    for(var i=0; i<h; ++i)
    {
        var dot = new Point(new Point(x_shift+i*w, y_shift+j*w) + new Point({angle:Math.random()*360, length:Math.random()*noise}) );
        dots.push(dot);
    }
    j++;
    
    j < v ? draw() : stitch();
}


function stitch(){
    
    for(var i=0; i<h-1; ++i)
    {
        var d1 = (k*(h))+i,
            d2 = d1+1,
            d3 = d1+h,
            d4 = d3+1,
            d5 = d2,
            d6 = d3;
        
        if(pattern != "diagonal")
        {
            if(pattern == "diamond" && k%2 == 0)
            {
                d2 = (k*(h))+i,
                d1 = d2+1,
                d4 = d2+h,
                d3 = d4+1;
            }
        
            d5 = i%2 == 0 ? d2 : d4;
            d6 = i%2 == 0 ? d3 : d1;
        }
	
	var color1 = raster.getPixel(i, k);
	var color2 = raster.getPixel(i+1, k);
        
        var path = new Path({fillColor:color1});
        path.add(dots[d1]);
        path.add(dots[d5]);
        path.add(dots[d3]);
        path.closePath();
        
        var path2 = new Path({fillColor:color2});
        path2.add(dots[d2]);
        path2.add(dots[d4]);
        path2.add(dots[d6]);
        path2.closePath();	
    }
    k++;
    
    if(k < v-1)
        stitch();
}

function setupPreview()
{
	var preview = rasterloader.clone();
	preview.size = new Size(80, 80 * rasterloader.size.height / rasterloader.size.width);
	preview.position = [45, 5 + preview.size.height * .5];	
	rasterloader.remove();
}

//INITIAL IMAGE LOAD
var rasterloader = new Raster("assets/1.jpg");
    rasterloader.on('load', function(){
	
	layer.activate();
	setupPreview();
	distort.fire();
        
});

//DRAG AND DROP IMAGE HANDLERS
function onDocumentDrag(event) {
	event.preventDefault();
}

function onDocumentDrop(event) {
	event.preventDefault();

	var file = event.originalEvent.dataTransfer.files[0];
	var reader = new FileReader();

	reader.onload = function (event) {
		var image = document.createElement('img');
		image.onload = function () {
			
			project.layers[1].activate();
			project.layers[1].removeChildren();
			
			rasterloader = new Raster(image);
			
			
			setupPreview();
			
			distort.fire();
			
		};
		image.src = event.target.result;
	};
	reader.readAsDataURL(file);
}

$(document).on({
	drop: onDocumentDrop,
	dragover: onDocumentDrag,
	dragleave: onDocumentDrag
});