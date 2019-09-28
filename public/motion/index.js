
var camera = {
	focus : 400,
	self : {
		x : 0,
		y : 0,
		z : 0
	},
	rotate : {
		x : 0,
		y : 0,
		z : 0
	},
	up : {
		x : 0,
		y : 1,
		z : 0
	},
	zoom : 1,
	display : {
		x : window.innerWidth/2,
		y : window.innerHeight/2,
		z : 0
	}
};
var affine = {
	world : {
		size : function(p, size) {
			return {
				x :	p.x * size.x,
				y : p.y * size.y,
				z : p.z * size.z
			}
		},
		rotate: {
			x : function(p, rotate) {
				return {
					x : p.x,
					y : p.y*Math.cos(dtr(rotate.x)) - p.z*Math.sin(dtr(rotate.x)),
					z : p.y*Math.sin(dtr(rotate.x)) + p.z*Math.cos(dtr(rotate.x))
				}
			},
			y : function(p, rotate) {
				return {
					x : p.x*Math.cos(dtr(rotate.y)) + p.z*Math.sin(dtr(rotate.y)),
					y : p.y,
					z : -p.x*Math.sin(dtr(rotate.y)) + p.z*Math.cos(dtr(rotate.y))
				}
			},
			z : function(p, rotate) {
				return {
					x : p.x*Math.cos(dtr(rotate.z)) - p.y*Math.sin(dtr(rotate.z)),
					y : p.x*Math.sin(dtr(rotate.z)) + p.y*Math.cos(dtr(rotate.z)),
					z : p.z
				}
			}
		},
		position : function(p, position) {
			return {
				x : p.x + position.x,
				y : p.y + position.y,
				z : p.z + position.z
			}
		},
	},
	view : {
		point : function(p) {
			return {
				x : p.x - camera.self.x,
				y : p.y - camera.self.y,
				z : p.z - camera.self.z
			}
		},
		x : function(p) {
			return {
				x : p.x,
				y : p.y*Math.cos(dtr(camera.rotate.x)) - p.z*Math.sin(dtr(camera.rotate.x)),
				z : p.y*Math.sin(dtr(camera.rotate.x)) + p.z*Math.cos(dtr(camera.rotate.x))
			}
		},
		y : function(p) {
			return {
				x : p.x*Math.cos(dtr(camera.rotate.y)) + p.z*Math.sin(dtr(camera.rotate.y)),
				y : p.y,
				z : p.x*-Math.sin(dtr(camera.rotate.y)) + p.z*Math.cos(dtr(camera.rotate.y))
			}
		},
		viewReset : function(p) {
			return {
				x : p.x - camera.self.x,
				y : p.y - camera.self.y,
				z : p.z - camera.self.z
			}
		},
		righthandedReversal : function(p) {
			return {
				x : p.x,
				y : -p.y,
				z : p.z,
			}
		}
	},
	perspective : function(p) {
		return {
			x : p.x * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
			y : p.y * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
			z : p.z * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
			p : ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
		}
	},
	display : function(p, display) {
		return {
			x : p.x + display.x,
			y : p.y + display.y,
			z : p.z + display.z,
			p : p.p,
		}
	},
	process : function(model, size, rotate, position,display) {
		var ret = affine.world.size(model, size);
		ret = affine.world.rotate.x(ret, rotate);
		ret = affine.world.rotate.y(ret, rotate);
		ret = affine.world.rotate.z(ret, rotate);
		ret = affine.world.position(ret, position);
		ret = affine.view.point(ret);
		ret = affine.view.x(ret);
		ret = affine.view.y(ret);
		ret = affine.view.viewReset(ret);
		ret = affine.view.righthandedReversal(ret);
		ret = affine.perspective(ret);
		ret = affine.display(ret, display);
		return ret;
	}
};



var vertex3d = function(param) {
	this.affineIn = new Object;
	this.affineOut = new Object;
	if(param.vertex !== undefined) {
		this.affineIn.vertex = param.vertex;
	} else {
		this.affineIn.vertex = {x:0,y:0,z:0};
	};
	if(param.size !== undefined) {
		this.affineIn.size = param.size;
	} else {
		this.affineIn.size = {x:1,y:1,z:1};
	};
	if(param.rotate !== undefined) {
		this.affineIn.rotate = param.rotate;
	} else {
		this.affineIn.rotate = {x:0,y:0,z:0};
	};
	if(param.position !== undefined) {
		this.affineIn.position = param.position;
	} else {
		this.affineIn.position = {x:0,y:0,z:0};
	};
};
vertex3d.prototype = {
	vertexUpdate : function() {
		this.affineOut = affine.process(
			this.affineIn.vertex,
			this.affineIn.size,
			this.affineIn.rotate,
			this.affineIn.position,
			camera.display
		);
	}
};

	var dtr = function(v) {return v * Math.PI/180;};
    //cordinate system transformation.
	//polar to rectangle.
	var polarToRectangle =  function(dX, dY, radius) {
		var x = Math.sin(dtr(dX)) * Math.cos(dtr(dY)) * radius;
		var y = Math.sin(dtr(dX)) * Math.sin(dtr(dY)) * radius;
		var z = Math.cos(dtr(dX)) * radius;
		return {x:y, y:z, z:x};
	};
	//rectangle to polar.
	var rectangleToPolar = function(x, y, z) {
		if(x == 0)	var xD = 0.001;
		else		var xD = x;
		if(y == 0)	var yD = 0.001;
		else		var yD = y;
		if(z == 0)	var zD = 0.001;
		else		var zD = z;
		var radius = Math.sqrt(xD*xD + yD*yD + zD*zD);
		var theta = Math.atan(zD / Math.sqrt(xD*xD + yD*yD));
		var phi = Math.atan(yD / xD);
		return {x:theta*(180/Math.PI), y:phi*(180/Math.PI), r:radius};
	};
	var closeValue = function(minTime, maxTime) {
		this.flag = 0;
		this.progress = 0;
		this.startTime = 0;
		this.durationTime = 0;
		this.fromValue = 0;
		this.toValue = 0;
		this.minValue = 0;
		this.maxValue = 1;
		this.minDuration = minTime;
		this.maxDuration = maxTime;
	};
	closeValue.prototype = {
		init : function() {
			this.durationTime = this.minDuration + (this.maxDuration-this.minDuration) * Math.random();
			this.startTime = Date.now();
			this.progress = Math.min(1, ((Date.now()-this.startTime)/this.durationTime))
			this.fromValue = this.toValue;
			this.toValue = this.minValue + this.maxValue * Math.random();
			this.flag = 1;
			return this.fromValue + (this.toValue - this.fromValue) * this.progress;
		},
		update : function() {
			this.progress = Math.min(1, ((Date.now()-this.startTime)/this.durationTime));
			if(this.progress== 1) this.flag = 0;
			return this.fromValue + (this.toValue - this.fromValue) * this.progress;
		},
		execution : function() {
			if(this.flag == 0)		{return this.init()}
			else if(this.flag == 1)	{return this.update()};
		}
	};

	var strokeColor = "rgba(255,255,255,0.1)";
	var backgroundColor = "rgba(0,0,0,1)";
	var vibrateFlag = false;
	
	var canvas = document.getElementById("canvas");
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	var ctx	= canvas.getContext("2d");
	ctx.strokeStyle = strokeColor;
		
	window.onresize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		camera.display.x = window.innerWidth/2;
		camera.display.y = window.innerHeight/2;
	};
	
	
	/* class */
	var	sphere = function(arg) {
		this.flag = true;
		this.type = "_";
		this.particleNum = arg.particleNum;
		this.center = {x:0, y:0, z:0};
		this.targetCenter = arg.center;
		this.radius = 0;
		this.targetRadius = arg.radius;
		
		this.degree = new Array();
		this.freeDegreeSpeed = new Array();
		for(var j=0; j<this.particleNum; j++) {
			this.degree[j] = {theta:0, phi:0};
			this.freeDegreeSpeed[j] = {theta:1*Math.random()-0.5, phi:1*Math.random()-0.5};
		};
		this.charsMap = new Object();
		for(var i in chars) {
			var buffer = document.getElementById(i).getContext("2d").getImageData(0, 0, 100, 100).data;
			this.charsMap[i] = new Array();
			var self = this;
			for(var j=0; j<this.particleNum; j++) {
				var redo = function() {
					var theta = Math.floor(Math.random()*100);
					var phi = Math.floor(Math.random()*100);
					if(buffer[(theta*400+(phi*4))] == 0) {
						self.charsMap[i].push(
							{
								theta:theta-50 + 360 * Math.round(Math.random()*2)-1,
								phi:phi-50 + 360 * Math.round(Math.random()*2)-1
							}
						);
					} else {
						redo();
					};
				};
				redo();	
			};
		};
		this.charsMap["@"] = new Array();
		for(var i=0; i<this.particleNum; i++) {
			this.charsMap["@"][i] = {theta:360*Math.random(), phi:360*Math.random()};
		};
		this.charsMap["_"] = new Array();
		for(var i=0; i<this.particleNum; i++) {
			this.charsMap["_"][i] = {theta:0, phi:0};
		};
		
		this.veticies = new Array();
		for(var i=0; i<this.particleNum; i++) {
			this.veticies[i] = new vertex3d({});
		};
	};
	sphere.prototype = {
		update : function() {
			for(var i=0; i<this.charsMap[this.type].length; i++) {
				if(this.degree[i].theta >= 30 && this.degree[i].phi >= 30) {
					this.flag = true;
					break;
				} else {
					this.flag = false;
				};	
			};
			this.radius =  this.radius + (this.targetRadius - this.radius) / 8;
			this.center.x = this.center.x + (this.targetCenter.x - this.center.x) / 8;
			this.center.y = this.center.y + (this.targetCenter.y - this.center.y) / 8;
			this.center.z = this.center.z + (this.targetCenter.z - this.center.z) / 8;
			for(var i=0; i<this.charsMap[this.type].length; i++) {
				if(this.type === "@") {
					this.charsMap[this.type][i].theta += this.freeDegreeSpeed[i].theta;
					this.charsMap[this.type][i].phi += this.freeDegreeSpeed[i].phi;
				};
				this.degree[i].theta =this.degree[i].theta + (this.charsMap[this.type][i].theta-this.degree[i].theta)/(4+20*Math.random());
				this.degree[i].phi = this.degree[i].phi + (this.charsMap[this.type][i].phi-this.degree[i].phi)/(4+20*Math.random());
				if(vibrateFlag == true) {
					var getPosition = polarToRectangle(this.degree[i].theta+90, this.degree[i].phi, this.radius+Math.random()*10);
				} else {
					var getPosition = polarToRectangle(this.degree[i].theta+90, this.degree[i].phi, this.radius);
				};
				this.veticies[i].affineIn.vertex = {
					x:getPosition.x,
					y:getPosition.y,
					z:getPosition.z
				};
				this.center.x
				this.veticies[i].affineIn.position = {
					x:this.center.x,
					y:this.center.y,
					z:this.center.z
				};
				this.veticies[i].vertexUpdate();
			};
		},
		draw : function() {
			if(this.flag == true) {
				ctx.beginPath();
				for(var i=0; i<this.veticies.length; i++) {
					for(var j=i; j<this.veticies.length; j++) {
						
						var distance = 
						(this.veticies[i].affineOut.x-this.veticies[j].affineOut.x)*(this.veticies[i].affineOut.x-this.veticies[j].affineOut.x) +
						(this.veticies[i].affineOut.y-this.veticies[j].affineOut.y)*(this.veticies[i].affineOut.y-this.veticies[j].affineOut.y);
						
						if(distance <= this.radius*3) {
							ctx.moveTo(
								this.veticies[i].affineOut.x,
								this.veticies[i].affineOut.y
							);
							ctx.lineTo(
								this.veticies[j].affineOut.x,
								this.veticies[j].affineOut.y
							);
						};
					};
				};
				ctx.closePath();
				ctx.stroke();
			};
		}
	};
	/* class */
	var sphereNum = 20;
	var s = new Array();
	/*-----------------------------------------------------*/
	var setup = function() {
		for(var i=0; i<sphereNum; i++) {
			s[i] = new sphere({radius:100, particleNum:250, center:{x:70*i - (sphereNum-1)*70/2,y:0,z:0}});
		};
	};
	/*-----------------------------------------------------*/
	var update = function() {
		for(var i=0; i<sphereNum; i++) {
			s[i].update();
		};
	};
	/*-----------------------------------------------------*/
	var draw = function() {
		for(var i=0; i<sphereNum; i++) {
			s[i].draw();
		};
	};
	
	var charsLength = 0;
	var charCounter = 0;
	var bufferImages = {};
	var bufferCanvases = {};
	for(var i in chars) {
		charsLength++;
		bufferImages[i] = new Image();
		bufferImages[i].src = chars[i];
		bufferImages[i].onload = function() {
			charCounter++;
			if(charCounter === charsLength) {
				bufferDraw();
			};
		};
	};
	var bufferDraw = function() {
		for(var i in chars) {
			var canvas = document.createElement("canvas");
			canvas.id = i;
			document.getElementById("buffer").appendChild(canvas);
			document.getElementById(i).getContext("2d").drawImage(
				bufferImages[i],
				0,
				0,
				100,
				100
			);
		};
		start();
	};

	var textChanger = function(text, sphereRadius, sphereSpace, unitTime) {
		var changeIncrement = 0;
		var charNum = text.length;
		var center = new Array();
		for(var i=0; i<charNum; i++) {
			center[i] = {x:sphereSpace*i - sphereSpace*(charNum-1)/2, y:0, z:0};
		};
		var changer = function() {
			setTimeout(function() {
				s[changeIncrement].type = text[changeIncrement];
				s[changeIncrement].targetCenter = center[changeIncrement]; 
				s[changeIncrement].targetRadius = sphereRadius; 
				changeIncrement++;
				if(changeIncrement < charNum) {
					changer();
				};
			}, unitTime);
		};
		for(var i=charNum; i<s.length; i++) {
			s[i].type = "_";
		};
		changer();
	};
	
	var fullSet = function() {
		var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ__?!1234567890";
		var col = 10;
		var colUnit = 80;
		var rowUnit = 120;
		for(var i=0; i<alpha.length; i++) {
			s[i].targetCenter = {
				x:(i%10)*colUnit - (col-1)*colUnit/2,
				y:Math.floor(i/10)*-rowUnit + 180,
				z:0
			};
			s[i].type = alpha[i];
		};
	};
	var textSet = [
		{text:"DEAR_GUAGUA", sphereRadius:140, sphereSpace:80, unitTime:10, time:6000},
    {text:"HAPPY_BIRTHDAY", sphereRadius:150, sphereSpace:70, unitTime:10, time:10000},
		{text:"@@@@@@@", sphereRadius:120, sphereSpace:70, unitTime:50, time:15000},
	];
	
	var textSetChangerIncrement = 0;
	var textSetChanger = function() {
		setTimeout(function() {			
			textChanger(
				textSet[textSetChangerIncrement].text,
				textSet[textSetChangerIncrement].sphereRadius,
				textSet[textSetChangerIncrement].sphereSpace,
				textSet[textSetChangerIncrement].unitTime
			);
			textSetChangerIncrement++;
			if(textSetChangerIncrement == textSet.length) {
				textSetChangerIncrement = 0;
			};
			textSetChanger();
		}, textSet[textSetChangerIncrement].time);
	};
	var vibrateCV = new closeValue(200, 500);
	var invertCV = new closeValue(1000, 1200);
	
	var start = function() {
		setup();
		setInterval(function() {
			if(vibrateCV.execution() > 0.8) {
				vibrateFlag = true;
			} else {
				vibrateFlag = false;
			};
			// if(invertCV.execution() > 0.7) {
			// 	strokeColor = "rgba(0,0,0,0.1)";
			// 	backgroundColor = "rgba(255,255,255,1)";
			// } else {
				strokeColor = "rgba(255,255,255,0.1)";
				backgroundColor = "rgba(0,0,0,1)";
			// };
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
			ctx.strokeStyle = strokeColor;
			update();
			draw();
		}, 1000/60);
		textSetChanger();
	};
	// document.body.onmousemove = function(e) {
  //   camera.rotate.x = e.pageY/window.innerHeight * 180 - 90;
  //   camera.rotate.y = e.pageX/window.innerWidth * 180 - 90;
  //   document.onmousedown = function() {camera.zoom = Math.random()*1+1};
  //   document.onmouseup = function() {camera.zoom = 1};
  // };