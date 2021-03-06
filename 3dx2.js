cnvs1 = document.getElementById("cnvs1")
ctx1 = cnvs1.getContext("2d")
cnvs2 = document.getElementById("cnvs2")
ctx2 = cnvs2.getContext("2d")

var width, height
window.addEventListener("resize", resize, true)

function resize(){
	cnvs1.width = cnvs2.width = width =  900 //Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	cnvs2.height = cnvs1.height = height = 720 //Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 2 - 100
}
resize()

document.addEventListener("keydown", keyPress)

twist = 0
angle = 0
tilt = 0

window.addEventListener("deviceorientation", function(event){
   //rotateCnvses(-1 * twist)
   tilt = (event.gamma / Math.abs(event.gamma) * 90) - event.gamma
   twist = event.beta
   angle = event.alpha
   if (tilt < 0) angle = (angle + 180) % 360;
   //if (tilt > 0) twist = (twist / Math.abs(twist)) * (180 - Math.abs(twist))
  
   angle = (angle - 180) * -1
   
   angle /= 10
   tilt /= 10
   twist /= 10
   
   cam.x = angle
   cam.z = tilt
   
   //rotateCnvses(twist)
   
   
}, true);



function keyPress(event){
	key = event.keyCode
	if (key == 81) cam.z += 0.2	//q
	if (key == 69) cam.z -= 0.2	//e
	if (key == 87) cam.y += 0.2	//w
	if (key == 83) cam.y -= 0.2	//s
	if (key == 65) cam.x -= 0.2	//a
	if (key == 68) cam.x += 0.2	//d
	project(cam)
}

colors = ["#F19292", "yellow", "teal", "green", "green", "cyan", "cyan", "cyan", "cyan", "cyan", "cyan", "orange"]

coords = [{x: 3, y: 20, z: 1}, {x: 2, y: 20, z: 1}, {x: 2, y: 20, z: 0}, {x: 3, y: 20, z: 0}, {x: 3, y: 22, z: 0}, {x: 2, y: 22, z: 0},														  //dad chair
{x: -1 , y: 17, z: 0}, {x: -1.5, y: 17, z: 0}, {x: -1.5, y: 17.5, z: 0}, {x: -1, y: 17.5, z: 0}, {x: -1 , y: 17, z: 3}, {x: -1.5, y: 17, z: 3}, {x: -1.5, y: 17.5, z: 3}, {x: -1, y: 17.5, z: 3}, //tall collumn
{x: 0, y: 16, z: 0}, {x: 0, y: 15, z: 0}, {x: -1, y: 15, z: 0}, {x: -1, y: 16, z: 0},					//flat shape on 0,0
{x: -4, y: 14, z: 0}, {x: -4, y: 23, z: 0}, {x: 4, y: 23, z: 0}, {x: 4, y: 14, z: 0},					//floor
{x: -4, y: 23, z: 0}, {x: 4, y: 23, z: 0}, {x: 4, y: 23, z: 2.5}, {x: -4, y: 23, z: 2.5},					//back wall
{x: -1, y: 23, z: 1.8}, {x: 1, y: 23, z: 1.8}, {x: 0, y: 23, z: 0.3}]									//triangle on back wall

shapeIndexs = [[22,23,24,25], [26,27,28], [18,19,20,21], [2,3,4,5], [0,1,2,3], [6,7,8,9], [8,9,13,12], [7,8,12,11], [6,9,13,10], [10,11,12,13], [6,7,11,10], [14,15,16,17]]
cam = {x: 0, y: 0, z: 3}

var pixAngleRatio = 18		//the amount of pixels that one degree spreads over
var eyeDif = 0.28
var side = "left"

function degFromRad(rad){			//returns degree angle from radian angle
	return rad * (180 / Math.PI)
}

function clearScreen(){				//returns canvas to balank screen
	ctx1.clearRect(0, 0, width, height)
	ctx2.clearRect(0, 0, width, height)
}

function drawPoint(horizontalAngle, verticalAngle){		//draws a single point from its angles from the center line( y axis )
	ctx.fillRect(width / 2 + horizontalAngle * pixAngleRatio, height / 2 - verticalAngle * pixAngleRatio, 2 , 2)
}

function drawLine(xStart, yStart, xFin, yFin){	//draws a line on the canvas
   ctx1.beginPath();
   ctx1.moveTo(xStart, yStart);
   ctx1.lineTo(xFin, yFin);
   ctx1.stroke();
   ctx2.beginPath();
   ctx2.moveTo(xStart, yStart);
   ctx2.lineTo(xFin, yFin);
   ctx2.stroke();
}


function drawCross(x, y, l){	 //draws a cross on canvas in relation to the midpoint
	drawLine( width/2 + x + l, height / 2 + y, width / 2 + x - l, height /2 + y)
	drawLine(width /2 + x, height / 2 + y + l,width / 2 + x, height /2 + y - l)
}

function drawAxis(){			//draws the two axis and center crosshar
	drawCross(0, 0, 30)
	for (a = 113.09; a <= 3 * 113.09; a += 113.09){
		drawCross(a, 0, 5)
		drawCross(-1 * a, 0, 5)
		drawCross(0, a, 5)
		drawCross(0, -1 * a, 5)
	}
}

function drawWorld(camera){		//draws the 3d objects from their coordinates and camera position onto canvas in 2d
	angles = []
	for (c = 0; c < coords.length; c++){
		coord = coords[c]		
		horizontalAngle = degFromRad(Math.atan((coord.x - camera.x) / Math.sqrt((coord.x - camera.x) * (coord.x - camera.x) + (coord.y - camera.y) * (coord.y - camera.y) )))
		verticalAngle = degFromRad(Math.atan((coord.z - camera.z) / (coord.y - camera.y)))
		//drawPoint(horizontalAngle, verticalAngle)
		//console.log(horizontalAngle)
		//console.log(verticalAngle)
		angles.push({h : horizontalAngle, v : verticalAngle})
	}
	drawAngles(angles)
}

function drawAngles(angles){		//draws a set of 3d coordinates from their vertical and horizontal angles from the center line (y axis)
	points = []
	for (a = 0; a < angles.length; a ++){
		points.push({x: width / 2 + angles[a].h * pixAngleRatio, y: height / 2 - angles[a].v * pixAngleRatio})
	}
	drawPoints(points)
}

function drawPoints(points){	//acctually does the drawing of the coordinates from the canvas coordinates fills in with reference to the shape index array
	if (side == "left"){
	for (s = 0; s < shapeIndexs.length; s++){
		shape = shapeIndexs[s]
		ctx1.strokeStyle = "black"
		ctx1.beginPath(points[shape[0]].y, height - points[shape[0]].x)
		for (p = 1; p < shape.length; p++){
			ctx1.lineTo(points[shape[p]].y, height - points[shape[p]].x)
			ctx1.stroke()
		}
		ctx1.lineTo(points[shape[0]].y, height - points[shape[0]].x)
		ctx1.stroke()
		ctx1.closePath()
		ctx1.fillStyle = colors[s]
		ctx1.fill()
	}
	}
	else {
	for (s = 0; s < shapeIndexs.length; s++){
		shape = shapeIndexs[s]
		ctx2.strokeStyle = "black"
		ctx2.beginPath(points[shape[0]].y, height - points[shape[0]].x)
		for (p = 1; p < shape.length; p++){
			ctx2.lineTo(points[shape[p]].y, height - points[shape[p]].x)
			ctx2.stroke()
		}
		ctx2.lineTo(points[shape[0]].y, height - points[shape[0]].x)
		ctx2.stroke()
		ctx2.closePath()
		ctx2.fillStyle = colors[s]
		ctx2.fill()
	}
	}
}



function project(){
	document.getElementById("data").innerText = parseInt(cam.x) + "," + parseInt(cam.y) + "," + parseInt(cam.z)
	clearScreen()
	side = "left"
	drawWorld({x: cam.x - eyeDif, y: cam.y, z: cam.z})
	side = "right"
	drawWorld({x: cam.x + eyeDif, y: cam.y, z: cam.z})
	drawAxis()
}
cur = 0


setInterval(project, 10)






function rotateCnvses(deg){
	ctx1.translate(width / 2, height / 2)
	ctx1.rotate(deg * Math.PI / 180)
	ctx1.translate(-1 * width / 2, - 1 * height / 2)
	ctx2.translate(width / 2, height / 2)
	ctx2.rotate(deg * Math.PI / 180)
	ctx2.translate(-1 * width / 2, - 1 * height / 2)
//put these in project...
	ctx1.setTransform(1, 0, 0, 1, 0, 0)
	ctx2.setTransform(1, 0, 0, 1, 0, 0)
}
