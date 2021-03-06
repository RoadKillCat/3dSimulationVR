cnvs = document.getElementById("cnvs")
ctx = cnvs.getContext("2d")

document.addEventListener("keydown", keyPress)

function keyPress(event){
	key = event.keyCode
	if (key == 88) cam.z -= 0.5				//x	fly down
	if (key == 90) cam.z += 0.5				//z fly up
	if (key == 87) takeStep(cam.yaw)		//w	walk forward
	if (key == 83) takeStep(cam.yaw + 180)	//s walk backwards
	if (key == 65) takeStep(cam.yaw - 90)	//a walk left
	if (key == 68) takeStep(cam.yaw + 90)	//d walk right
	if (key == 69) cam.yaw   += 3				//e	//look left
	if (key == 81) cam.yaw   -= 3  			    //q	//look right
	if (key == 82) cam.pitch += 3				//r	//look up
	if (key == 70) cam.pitch -= 3   			//f	//look down
	if (key == 89) cam.roll  += 3				//y //roll left
	if (key == 84) cam.roll  -= 3				//t //roll right
	
	renderWorld()
}

var width, height

cnvs.width = width = 720
cnvs.height = height = 480

colors = ["#F19292", "yellow", "teal", "green", "cyan", "orange"]

coordinates = [{x: 3, y: 20, z: 1}, {x: 2, y: 20, z: 1}, {x: 2, y: 20, z: 0}, {x: 3, y: 20, z: 0}, {x: 3, y: 22, z: 0}, {x: 2, y: 22, z: 0},														  //dad chair
{x: -1 , y: 17, z: 0}, {x: -1.5, y: 17, z: 0}, {x: -1.5, y: 17.5, z: 0}, {x: -1, y: 17.5, z: 0}, {x: -1 , y: 17, z: 3}, {x: -1.5, y: 17, z: 3}, {x: -1.5, y: 17.5, z: 3}, {x: -1, y: 17.5, z: 3}, //tall collumn
{x: 0, y: 16, z: 0}, {x: 0, y: 15, z: 0}, {x: -1, y: 15, z: 0}, {x: -1, y: 16, z: 0},					//square on floor
{x: -4, y: 14, z: 0}, {x: -4, y: 23, z: 0}, {x: 4, y: 23, z: 0}, {x: 4, y: 14, z: 0},					//floor
{x: -4, y: 23, z: 0}, {x: 4, y: 23, z: 0}, {x: 4, y: 23, z: 2.5}, {x: -4, y: 23, z: 2.5},			    //back wall
{x: -1, y: 23, z: 1.8}, {x: 1, y: 23, z: 1.8}, {x: 0, y: 23, z: 0.3}]									//triangle on back wall


faceVerticies = [
{v: [22,23,24,25], c: 0}, 					//back wall
{v: [26,27,28], c: 1},						//triangle on back wall
{v: [18,19,20,21], c: 2},					//floor
{v: [2,3,4,5], c: 3}, {v: [0,1,2,3], c: 3},																											//dad chair
{v: [6,7,8,9], c: 4}, {v: [8,9,13,12], c: 4}, {v: [7,8,12,11], c: 4}, {v: [6,9,13,10], c: 4}, {v: [10,11,12,13], c: 4}, {v: [6,7,11,10], c: 4},		//tall collumn
{v: [14,15,16,17], c: 5}]					//square on floor


cam = {x: 0, y: 0, z: 3, pitch: 0, yaw: 0, roll: 0}		//coordinates of the camera
pixAngleRatio = 18					//the amount of pixels that one degree spreads over
step = 0.5

distanceBetween = (co1, co2) => Math.sqrt(Math.pow(co2.x - co1.x , 2) + Math.pow(co2.y - co1.y , 2) + Math.pow(co2.z - co1.z , 2))

function centroidFace(face){	
	face = face.map(co => coordinates[co])
	avgCo = {x: 0, y: 0, z: 0}
	for (c = 0; c < face.length; c++){
		cord = face[c]
		avgCo.x += cord.x
		avgCo.y += cord.y
		avgCo.z += cord.z
	}
	return {x: avgCo.x / face.length, y: avgCo.y / face.length, z: avgCo.z / face.length}
}


function takeStep(yaw){
	cam.x = step * Math.sin(radFromDeg(yaw)) + cam.x
	cam.y = step * Math.cos(radFromDeg(yaw)) + cam.y
}

function sortFaceVerticies(a, b){
	if ( distanceBetween(cam, centroidFace(a.v)) >  distanceBetween(cam, centroidFace(b.v)) ) return -1
	return 1
}
	

function drawPoints(canvasCoordinates){	//acctually does the drawing of the coordinates from the canvas coordinates fills in with reference to the shape index array
	sortedFaces = faceVerticies//.sort(sortFaceVerticies)
	for (s = 0; s < sortedFaces.length; s++){
		shape = sortedFaces[s].v
		ctx.strokeStyle = "black"
		ctx.beginPath(canvasCoordinates[shape[0]].x, canvasCoordinates[shape[0]].y)
		for (p = 1; p < shape.length; p++){
			ctx.lineTo(canvasCoordinates[shape[p]].x, canvasCoordinates[shape[p]].y)
			ctx.stroke()
		}
		ctx.lineTo(canvasCoordinates[shape[0]].x, canvasCoordinates[shape[0]].y)
		ctx.stroke()
		ctx.closePath()
		ctx.fillStyle = colors[sortedFaces[s].c]
		ctx.fill()
	}
}

function renderObjects(){		//draws the 3d objects from their coordinates and cam position onto canvas in 2d
	
	xWorldRotate = (r) => (o => ({x: o.x,  y: ( (o.y - cam.y) * Math.cos(r) + ((o.z - cam.z) * Math.sin(r)) ) + cam.y ,  z: ( ( -1 * (o.y - cam.y) * Math.sin(r)) + ((o.z - cam.z) * Math.cos(r)) ) + cam.z }))
	yWorldRotate = (r) => (o => ({x: ( ((o.x - cam.x) * Math.cos(r)) + ((o.z - cam.z) * Math.sin(r))) + cam.x ,  y:  o.y,  z : ( -1 * ((o.x - cam.x) * Math.sin(r)) + ((o.z - cam.z) * Math.cos(r)) ) + cam.z}))
	zWorldRotate = (r) => (o => ({x: ( ((o.x - cam.x) * Math.cos(r)) - ((o.y - cam.y) * Math.sin(r))) + cam.x ,  y: ( ((o.x - cam.x) * Math.sin(r)) + ((o.y - cam.y) * Math.cos(r)) ) + cam.y,  z: o.z}))
	
	transformedCoords = coordinates.map( xWorldRotate(radFromDeg(cam.pitch)) ).map( zWorldRotate(radFromDeg(cam.yaw) )).map( yWorldRotate(radFromDeg(cam.roll) ) )
	
	coordinateAngles = transformedCoords.map(o => ({yaw: degFromRad(Math.atan((o.x - cam.x) / Math.sqrt((o.x - cam.x) * (o.x - cam.x) + (o.y - cam.y) * (o.y - cam.y) ))), pitch: degFromRad(Math.atan((o.z - cam.z) / (o.y - cam.y))) })  )
	
	canvasCoordinates = coordinateAngles.map(o => ( { x: width / 2 + (o.yaw * pixAngleRatio), y: height / 2 - (o.pitch * pixAngleRatio) } ))
	
	drawPoints(canvasCoordinates)
}


function renderWorld(){			 //draws the world from given cam perspective and object coodinates
	document.getElementById("data").innerText = "Camera \xa0 x: " + padLeft(cam.x) + ", y: " + padLeft(cam.y) + ", z: " + padLeft(cam.z) + ", yaw: " + padLeft(cam.yaw) +  ", pitch: " + padLeft(cam.pitch) + ", roll: " + padLeft(cam.roll)

	clearScreen()
	
	renderObjects()
	renderCrosshairs()
}

renderWorld()



//SHORT SPECIFIC FUNCTIONS//SHORT SPECIFIC FUNCTIONS//SHORT SPECIFIC FUNCTIONS//SHORT SPECIFIC FUNCTIONS//SHORT SPECIFIC FUNCTIONS//SHORT SPECIFIC FUNCTIONS//SHORT SPECIFIC FUNCTIONS//SHORT SPECIFIC FUNCTIONS

function padLeft(num){		//returns string of number padded from left to make a 5 charachter string
	return ("\xa0\xa0\xa0\xa0" + parseInt(num)).slice(-5)
}



function drawLine(xStart, yStart, xFin, yFin){	//draws a line on the canvas
   ctx.beginPath();
   ctx.moveTo(xStart, yStart);
   ctx.lineTo(xFin, yFin);
   ctx.stroke();
}

function drawCross(x, y, l){	 //draws a cross on canvas in relation to the midpoint
	drawLine( width/2 + x + l, height / 2 + y, width / 2 + x - l, height /2 + y)
	drawLine(width /2 + x, height / 2 + y + l,width / 2 + x, height /2 + y - l)
}

function renderCrosshairs(){			//draws the two axis and center crosshar
	drawCross(0, 0, 30)
	for (a = 113.09; a <= 3 * 113.09; a += 113.09){
		drawCross(a, 0, 5)
		drawCross(-1 * a, 0, 5)
		drawCross(0, a, 5)
		drawCross(0, -1 * a, 5)
	}
}

function degFromRad(rad){			//returns degree angle from radian angle
	return rad * (180 / Math.PI)
}

function radFromDeg(deg){
	return deg * ( Math.PI / 180)
}

function clearScreen(){				//returns canvas to balank screen
	ctx.clearRect(0, 0, width, height)
}





//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW//USELESS FUNCTIONS BELOW


function drawAngles(coordinateAngles){		//draws a set of 3d coordinates from their vertical and horizontal angles from the center line (y axis)
	canvasCoordinates = []
	for (a = 0; a < coordinateAngles.length; a ++){
		canvasCoordinates.push({x: width / 2 + coordinateAngles[a].h * pixAngleRatio, y: height / 2 - coordinateAngles[a].v * pixAngleRatio})
	}
	drawPoints(canvasCoordinates)
}
	


function drawPoint(horizontalAngle, verticalAngle){		//draws a single point from its angles from the center line( y axis )
	ctx.fillRect(width / 2 + horizontalAngle * pixAngleRatio, height / 2 - verticalAngle * pixAngleRatio, 2 , 2)
}

function rotateCoordRoundX(deg){
	deg = radFromDeg(deg)
	for (c = 0; c < coords.length; c++){		
		coord = coords[c]
		coord.y -= cam.y
		coord.z -= cam.z
		yCo = coord.y						//translate each point as if cam was at the origin
		zCo = coord.z
		coord.y = yCo * Math.cos(deg) + zCo * Math.sin(deg)			//rotate around origin for that point
		coord.z = yCo * -1 * Math.sin(deg) + zCo * Math.cos(deg)
		coord.y += cam.y					//translate each point back
		coord.z += cam.z
	}	
}

function rotateCoordRoundZ(deg){
	deg = radFromDeg(deg)
	for (c = 0; c < coords.length; c++){		
		coord = coords[c]
		coord.x -= cam.x
		coord.y -= cam.y
		xCo = coord.x						//translate each point as if cam was at the origin
		yCo = coord.y
		coord.x = xCo * Math.cos(deg) + yCo * Math.sin(deg)			//rotate around origin for that point
		coord.y = xCo * -1 * Math.sin(deg) + yCo * Math.cos(deg)
		coord.x += cam.x					//translate each point back
		coord.y += cam.y
	}	
}
