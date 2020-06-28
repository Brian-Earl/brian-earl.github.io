let canvas;
let gl;
let projMatrix;
let viewMatrix;
let modelView;
let mvMatrix;

//The Field of Vision and the Aspect Ratio
let fovy = 45;
let aspect;
let theta = 0;

//letiables used for lighting
let lightPosition = vec4(0.0, 1.0, 30.0, 1.0);
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
let lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
let lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
let materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
let materialDiffuse = vec4(0.4, 0.4, 0.4, 1.0);
let materialSpecular = vec4(0.2, 0.2, 0.2, 1.0);
let materialShininess = 5.0;

//letiables used for creating spheres
let pointsArray = [];
let index = 0;
let va = vec4(0.0, 0.0, -1.0, 1);
let vb = vec4(0.0, 0.942809, 0.333333, 1);
let vc = vec4(-0.816497, -0.471405, 0.333333, 1);
let vd = vec4(0.816497, -0.471405, 0.333333, 1);
let numTimesToSubdivide = 5;

//Constrols how far spread out each layer is from the previous
let seperationAmount = 4;

//The parent node of the mobile
let parentNode;

//Stack used for hierarchy rendering
let stack = [];

//Keeps Track of how large the spotlight is
let spotLightSize = .50;

//Variables used for texture coordinates
var minT = 0.0;
var maxT = 4;
var texCoord = [
    vec2(minT, minT),
    vec2(minT, maxT),
    vec2(maxT, maxT),
    vec2(maxT, minT)
];

//List of texture urls
let textures = {
	grass:"http://web.cs.wpi.edu/~jmcuneo/grass.bmp",
	stone:"http://web.cs.wpi.edu/~jmcuneo/stones.bmp",
	environmentNX:"http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvnegx.bmp",
	environmentNY:"http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvnegy.bmp",
	environmentNZ:"http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvnegz.bmp",
	environmentPX:"http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvposx.bmp",
	environmentPY:"http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvposy.bmp",
	environmentPZ:"http://web.cs.wpi.edu/~jmcuneo/env_map_sides/nvposz.bmp"
};

//List of all of the textures preloaded in so they dont need to be loaded in once
let loadedTextures = {};

//Premade selection of multiple colors 
let colors = {
	"red": vec4(1.0, 0.0, 0.0, .5),
	"green": vec4(0.0, .5, 0.0, .5),
	"blue": vec4(0.0, 0.0, 1.0, .5),
	"wall-blue": vec4(0.2, 0.2, 1.0, 1),
	"yellow": vec4(.5, .5, 0.0, .5),
	"cyan": vec4(0.0, .1, .5, 1),
	"magenta": vec4(1.0, 0.0, 1.0, .5),
	"white": vec4(1.0, 1.0, 1.0, 1.0),
	"floor-grey": vec4(.7, .7, .7, 1.0),
	"offWhite":  vec4(.5, .5, .5, .5)
};

//Variables for rendering the walls and floor
let environment = [];
let environmentNormals = [];
let environmentCoords = [];

//Keeps track of if the walls and floor should be textured
let isTex = true;

//Keeps track of if there should be refraction and reflection
let isRefract = false;
let isReflect = false;

//Keeps track of if there should be shadows
let isShadows = false;

function main() 
{
	canvas = document.getElementById('webgl');
	gl = WebGLUtils.setupWebGL(canvas, undefined);
	if (!gl) 
	{
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	
	//Initialize the shaders
	program = initShaders(gl, "vshader", "fshader");
	gl.useProgram(program);
	gl.viewport(0, 0, canvas.width, canvas.height);

	//Get the aspect ratio of the window
	aspect = canvas.width / canvas.height;

	// Set clear color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	//Enable depth test and back face culling
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	//Create variables for the vertices, extents and normals for the cube and sphere
	let blankCube = cube();
	let cubeExtents = extents(blankCube);
	let cubeNormals = getGourandNormals(blankCube);
	let cubeTextureCoords = texCoordsArray;
	let blankSphere = sphere();
	let sphereExtents = extents(blankSphere);
	let sphereNormals = getGourandNormals(blankSphere);
	let sphereTextureCoords = texCoordsArray;
	
	//Set up Walls and Floor environment
	environment.push(quad(2, 3, 7, 6), quad(5, 4, 7, 6), quad(0, 3, 7, 4));
	environmentNormals.push(getGourandNormals(quad(2, 3, 7, 6)), getGourandNormals(quad(5, 4, 7, 6)), getGourandNormals(quad(0, 3, 7, 4)));
	environmentCoords.push(quadTextures(), quadTextures(), quadTextures());

	//Scaling wall to make it larger
	for(var i = 0; i < environment[0].length; i++)
		environment[0][i][3] = .03;

	for(var i = 0; i < environment[0].length; i++)
		environment[1][i][3] = .03;

	//Create the mobile
	parentNode = (new node(blankCube, cubeNormals, cubeTextureCoords, colors.red, null, null, cubeExtents));
	parentNode.insertChild(new node(blankSphere, sphereNormals, sphereTextureCoords, colors.cyan, null, null, sphereExtents));
	parentNode.insertChild(new node(blankCube, cubeNormals, cubeTextureCoords, colors.green, null, null, cubeExtents));
	parentNode.insertChild(new node(blankSphere, sphereNormals, sphereTextureCoords, colors.yellow, null, null, sphereExtents));
	parentNode.insertChild(new node(blankCube, cubeNormals, cubeTextureCoords, colors.blue, null, null, cubeExtents));
	parentNode.insertChild(new node(blankSphere, sphereNormals, sphereTextureCoords, colors.magenta, null, null, sphereExtents));
	parentNode.insertChild(new node(blankCube, cubeNormals, cubeTextureCoords, colors.offWhite, null, null, cubeExtents));

	//Preload all of the texture images
	loadedTextures["grass"] = loadImage(textures.grass);
	loadedTextures["stone"] = loadImage(textures.stone);
	loadedTextures["environmentPX"] = loadImage(textures.environmentPX);
	loadedTextures["environmentNX"] = loadImage(textures.environmentNX);
	loadedTextures["environmentPY"] = loadImage(textures.environmentPY);
	loadedTextures["environmentNY"] = loadImage(textures.environmentNY);
	loadedTextures["environmentPZ"] = loadImage(textures.environmentPZ);
	loadedTextures["environmentNZ"] = loadImage(textures.environmentNZ);

	prerender();
}

let id, m;

//Handles calculations that only need to be mode once before rendering as to save resources
function prerender(){
	let thisProj = perspective(fovy, aspect, 0.1, 10000);
	let projMatrix = gl.getUniformLocation(program, 'projMatrix');
	gl.uniformMatrix4fv(projMatrix, false, flatten(thisProj));

	let offsetLoc = gl.getUniformLocation(program, "vPointSize");
	gl.uniform1f(offsetLoc, 10.0);

	let diffuseProduct = mult(lightDiffuse, materialDiffuse);
	let specularProduct = mult(lightSpecular, materialSpecular);
	let ambientProduct = mult(lightAmbient, materialAmbient);

	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
	gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
	gl.uniform1f(gl.getUniformLocation(program, "spotlightSize"), spotLightSize);

	gl.uniform1f(gl.getUniformLocation(program, "isReflect"), 0.0);
	gl.uniform1f(gl.getUniformLocation(program, "isRefract"), 0.0);
	gl.uniform1f(gl.getUniformLocation(program, "isShadow"), 0.0);

	//Calculations for shadows
	m = mat4();
	m[3][3] = 0;
	m[3][2] = -1/lightPosition[2];
		
	render();
}
let eye, at, up;
//Handles the render of the mobile
function render() {
	cancelAnimationFrame(id);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//Center the view to get the entire mobile in  view
	let nodeHeight = getNodeHeight(parentNode);
	let width = parentNode.width;
	eye = vec3(0, -nodeHeight, seperationAmount * width * nodeHeight);
	at = vec3(0, -nodeHeight, 0);
	up = vec3(0.0, 1.0, 0.0);

	viewMatrix = lookAt(eye, at, up);

	let viewMatrixLoc = gl.getUniformLocation(program, 'viewMatrix');
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

	modelView = gl.getUniformLocation(program, "modelMatrix");

	gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));

	//Load in the environment map for reflection and refraction
	configureCubeMap();

	//Draws the walls and floor environment
	drawWallsAndFloor();

	//Reset view matrix for mobile
	viewMatrix = stack.pop();

	//Rotate the models
	theta+=.5;

	//Draw the mobile
	gl.uniform1f(gl.getUniformLocation(program, "isTextured"), 0.0);
	parentNode.draw();

	id = requestAnimationFrame(render);
}

//Render the walls and floor environment
function drawWallsAndFloor(){
	stack.push(viewMatrix);
	let nodeHeight = getNodeHeight(parentNode);

	let drawColors = [];
	drawColors.push(colors["wall-blue"], colors["wall-blue"], colors["wall-blue"], colors["wall-blue"], colors["wall-blue"], colors["wall-blue"]);

	//Render first wall
	gl.uniform1f(gl.getUniformLocation(program, "isTextured"), 1.0);

	let vNormal = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vNormal);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(environmentNormals[0]), gl.STATIC_DRAW);

	let vNormalPosition = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormalPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormalPosition);

	let pBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(environment[0]), gl.STATIC_DRAW);

	let vPosition = gl.getAttribLocation(program,  "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	let cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(drawColors), gl.STATIC_DRAW);

	let vColor= gl.getAttribLocation(program,  "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	createATexture(colors["wall-blue"]);

	//If the wall is to be texture, load in the texure
	//Else the wall will be a plane color 
	//This holds true for the other wall and floor
	if(isTex)
		configureATexture(loadedTextures.stone);

	var tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(environmentCoords[0]), gl.STATIC_DRAW);

	var tPosition = gl.getAttribLocation(program, "vTexCoord");
	gl.vertexAttribPointer(tPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(tPosition);

	viewMatrix = mult(viewMatrix, translate(-20, -nodeHeight+3, -30));
	viewMatrix = mult(viewMatrix, rotateY(-45));
	gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));

	gl.drawArrays(gl.TRIANGLES, 0, environment[0].length);

	//Render Second Wall
	viewMatrix = stack.pop();
	stack.push(viewMatrix);

	pBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(environment[1]), gl.STATIC_DRAW);

	vPosition = gl.getAttribLocation(program,  "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);


	viewMatrix = mult(viewMatrix, translate(0, -nodeHeight+3, -10));
	viewMatrix = mult(viewMatrix, rotateY(-45));
	gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));

	gl.drawArrays(gl.TRIANGLES, 0, environment[1].length);

	//Render Floor
	viewMatrix = lookAt(eye, at, up);

	pBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(environment[1]), gl.STATIC_DRAW);

	vPosition = gl.getAttribLocation(program,  "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(drawColors), gl.STATIC_DRAW);

	vColor= gl.getAttribLocation(program,  "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	createATexture(colors["floor-grey"]);

	if(isTex)
		configureATexture(loadedTextures.grass);

	viewMatrix = mult(viewMatrix, translate(2, -nodeHeight+2, -10));
	viewMatrix = mult(viewMatrix, rotateX(-90));
	viewMatrix = mult(viewMatrix, rotateZ(45));
	viewMatrix = mult(viewMatrix, scalem(2, 1, 1));
	gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));

	gl.drawArrays(gl.TRIANGLES, 0, environment[2].length);
}

let texture;

//Create a plane color texutre from the color input
function createATexture(color) {

	let r = parseInt(color[0] * 255);
	let g = parseInt(color[1] * 255);
	let b = parseInt(color[2] * 255);
	
	texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([r, g, b, 255, r, g, b, 255, r, g, b, 255, r, g, b, 255])
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
}

//Create a texture from an image input
function configureATexture(image) {

	texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

//Load texture image from a URL
function loadImage(url){
	var image = new Image();
	image.crossOrigin = "";
	image.src = url;
	image.onload = function() {
		return image;
	};
	return image.onload();
}

let cubeMap;

//Load the environment cube map with texturee images
function configureCubeMap() {
    cubeMap = gl.createTexture();

	gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, loadedTextures.environmentPX);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, loadedTextures.environmentNX);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, loadedTextures.environmentPY);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, loadedTextures.environmentNY);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, loadedTextures.environmentPZ);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, loadedTextures.environmentNZ);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "textureMap"), 2);
}

//Toggle textures on and off
function toggleTexure(){
	isTex = !isTex;
}

function toggleShadow(){
	isShadows = !isShadows;
}

//Toggle refraction on and off
function toggleRefract(){
	isRefract = !isRefract;

	if(isRefract)
		gl.uniform1f(gl.getUniformLocation(program, "isRefract"), 1.0);
	else
		gl.uniform1f(gl.getUniformLocation(program, "isRefract"), 0.0);
}

//Toggle reflection on and off
function toggleReflect(){
	isReflect = !isReflect;

	if(isReflect)
		gl.uniform1f(gl.getUniformLocation(program, "isReflect"), 1.0);
	else
		gl.uniform1f(gl.getUniformLocation(program, "isReflect"), 0.0);
}

let texCoordsArray = [];

//Generate texture coords for a quad
function quadTextures() {
	let coords = [];
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[1]);
	texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[3]);

	coords.push(texCoord[0]);
	coords.push(texCoord[1]);
	coords.push(texCoord[2]);
	coords.push(texCoord[0]);
	coords.push(texCoord[2]);
	coords.push(texCoord[3]);
	return coords;
}

//Generate texture coords for a triangle
function triangleTextures(){
	texCoordsArray.push(texCoord[0]);
	texCoordsArray.push(texCoord[1]);
	texCoordsArray.push(texCoord[2]);
}

//Creates a cube model and returns all of its vertices
function cube(){
	let verts = [];
	texCoordsArray = [];
	verts = verts.concat(quad(1, 0, 3, 2));
	verts = verts.concat(quad(2, 3, 7, 6));
	verts = verts.concat(quad(3, 0, 4, 7));
	verts = verts.concat(quad(6, 5, 1, 2));
	verts = verts.concat(quad(4, 5, 6, 7));
	verts = verts.concat(quad(5, 4, 0, 1));
	return verts;
}
 
//Helper function to the creation of a cube
function quad(a, b, c, d){
	let verts = [];

	let vertices = [
		vec4(-0.5, -0.5,  0.5, 1.0),
		vec4(-0.5,  0.5,  0.5, 1.0),
		vec4(0.5,  0.5,  0.5, 1.0),
		vec4(0.5, -0.5,  0.5, 1.0),
		vec4(-0.5, -0.5, -0.5, 1.0),
		vec4(-0.5,  0.5, -0.5, 1.0),
		vec4(0.5,  0.5, -0.5, 1.0),
		vec4(0.5, -0.5, -0.5, 1.0)
	];

	let indices = [ a, b, c, a, c, d ];

	for (let i = 0; i < indices.length; ++i){
		verts.push(vertices[indices[i]]);
	}
	quadTextures();
	return verts;
}

//Creates a sphere model and returns all of the vertices
function sphere(){
	texCoordsArray = [];
	pointsArray = [];
	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	return pointsArray;
}

//Helper function to the creation of a sphere
function triangle(a, b, c) {
	pointsArray.push(c);
	pointsArray.push(b);
	pointsArray.push(a);
	triangleTextures();
	index += 3;
}

//Helper function to the creation of a sphere
function divideTriangle(a, b, c, count) {
	if (count > 0) {

		let ab = mix(a, b, 0.5);
		let ac = mix(a, c, 0.5);
		let bc = mix(b, c, 0.5);

		ab = normalize(ab, true);
		ac = normalize(ac, true);
		bc = normalize(bc, true);

		divideTriangle(a, ab, ac, count - 1);
		divideTriangle(ab, b, bc, count - 1);
		divideTriangle(bc, c, ac, count - 1);
		divideTriangle(ab, bc, ac, count - 1);
	}
	else {
		triangle(a, b, c);
	}
}

//Helper function to the creation of a sphere
function tetrahedron(a, b, c, d, n) {
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

//Calculates the height of the node given
function getNodeHeight(aNode){
	if(aNode == null || aNode == undefined)
		return 0;
	let left = getNodeHeight(aNode.lChild);
	let right = getNodeHeight(aNode.rChild);
	return 1 + Math.max(left, right); 
}

//Calculates the total number of nodes in a tree
function getNodeSize(aNode){
	if(aNode == null || aNode == undefined)
		return 0;
	let left = getNodeHeight(aNode.lChild);
	let right = getNodeHeight(aNode.rChild);
	return 1 + left + right; 
}

//Calculates the distance between the current node and the top of the tree
function getNodeUpwardHeight(aNode){
	if(aNode == null || aNode.parent == null)
		return 1;
	return 1 + getNodeUpwardHeight(aNode.parent);
}

//Returns an array of the extents in the X,Y and Z directions for the vertices given
function extents(model){
	let xExtents = [model[0][0], model[0][0]];
	let yExtents = [model[0][1], model[0][1]];
	let zExtents = [model[0][2], model[0][2]];

	for(let i = 0; i < model.length; i++){
		if(xExtents[0] > model[i][0])
			xExtents[0] = model[i][0];
		if(xExtents[1] < model[i][0])
			xExtents[1] = model[i][0];

		if(yExtents[0] > model[i][1])
			yExtents[0] = model[i][1];
		if(yExtents[1] < model[i][1])
			yExtents[1] = model[i][1];

		if(zExtents[0] > model[i][1])
			zExtents[0] = model[i][1];
		if(zExtents[1] < model[i][1])
			zExtents[1] = model[i][1];
	}
	let allExtents = [];
	allExtents.push(xExtents, yExtents, zExtents);
	return allExtents;
} 

//Returns an array of normal values for the vertices given
//Used for flat lighting
function getNormals(model){
	let normals = [];
	for(let i = 0; i < model.length; i+=3){
		let a = model[i];
		let b = model[i+1];
		let c = model[i+2];

		let normalX = (a[1] - b[1]) * (a[2] + b[2]) + (b[1] - c[1]) * (b[2] + c[2]) + (c[1] - a[1]) * (c[2] + a[2]);
		let normalY = (a[2] - b[2]) * (a[0] + b[0]) + (b[2] - c[2]) * (b[0] + c[0]) + (c[2] - a[2]) * (c[0] + a[0]);
		let normalZ = (a[0] - b[0]) * (a[1] + b[1]) + (b[0] - c[0]) * (b[1] + c[1]) + (c[0] - a[0]) * (c[1] + a[1]);
		let normal = normalize(vec4(normalX, normalY, normalZ, 0));
		normals.push(normal, normal, normal);
	}
	return normals;
}

//Returns an array of normal values for the vertices given
//Used for Gourand lighting
function getGourandNormals(model){
	let normals = [];
	model.map(([x, y, z]) => {
		normals.push(normalize(vec4(x, y, z, 0)));
	  });
	  return normals;
}

//Set the lighting mode to flat lighting
function flatRender(){
	parentNode.flat();
}

//Set the lighting mode to Gourand lighting
function gourandRender(){
	parentNode.gourand();
}

//Alter the size of the spotlight
function alterSpotlight(increment){
	spotLightSize += increment;
	gl.uniform1f(gl.getUniformLocation(program, "spotlightSize"), spotLightSize);
}

//The node class is an individual node inside of a binary tree which is then used to contruct the mobile
//Each node can have a child to its left and a child to its right
//When drawn, the program will go down the hierarchy and draw the tree from top to bottom
//This makes adding new models to the hierarchy easier as the rendering for each does not need to be hard coded in and will be done automatically
//Each node also contains its own normals and extents for different calculations that will be made 
//The color for each model is selected upon creation 
//normals can be switched between flat and Gourand rendering with the flat() and gourand() methods
class node {
	constructor(vertices, normals, texCoords, color, rChild, lChild, extents){
		this.vertices = vertices;
		this.normals = normals;
		this.texCoords = texCoords;
		this.color = color;
		this.rChild = rChild;
		this.lChild = lChild;
		this.parent = null;
		this.extents = extents;
		this.width = this.extents[0][1] - this.extents[0][0];
		this.height = this.extents[1][1] - this.extents[1][0];
		this.centerX = (this.extents[0][1] + this.extents[0][0])/2;
		this.centerY = (this.extents[1][1] + this.extents[1][0])/2;
	}

	//Insert a child into the tree from right to left
	insertChild(newChild) {
		//Scale all models in proportion to the size of the model at the top of the tree using the largest side of either the X, Y or Z axis
		let scaleFactor = Math.max((newChild.extents[0][1] - newChild.extents[0][0])/(parentNode.extents[0][1] - parentNode.extents[0][0]), (newChild.extents[1][1] - newChild.extents[1][0])/(parentNode.extents[1][1] - parentNode.extents[1][0]), (newChild.extents[2][1] - newChild.extents[2][0])/(parentNode.extents[2][1] - parentNode.extents[2][0]));
		for(let i = 0; i < newChild.vertices.length; i++)
			newChild.vertices[i][3] = scaleFactor;

		//Go from left to right inserting nodes into the tree
		if(this.rChild == null){
			this.rChild = newChild;
			this.rChild.parent = this;
		}
		else if(this.lChild == null){
			this.lChild = newChild;
			this.lChild.parent = this;
		}
		else{
			if(getNodeSize(this.rChild) > getNodeSize(this.lChild))
				this.lChild.insertChild(newChild);
			else
				this.rChild.insertChild(newChild);
		}
	}

	//Recursively draws the current model and then all those below it in the hierarchy
	draw(){
		gl.uniform1f(gl.getUniformLocation(program, "isShadow"), 0.0);
		//Get rotate direction for the lower below
		//Each layer will rotate in the opposite direction of the layer above
		let rotateDir = Math.pow(-1, getNodeUpwardHeight(this) + 1);

		//Set buffers for drawing the current model
		let drawColors = [];
		for(let i = 0; i < this.vertices.length; i++)
		{
			drawColors.push(this.color);
		}

		let vNormal = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vNormal);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
	
		let vNormalPosition = gl.getAttribLocation(program, "vNormal");
		gl.vertexAttribPointer(vNormalPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vNormalPosition);

		let pBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);

		let vPosition = gl.getAttribLocation(program,  "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		let cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(drawColors), gl.STATIC_DRAW);

		let vColor= gl.getAttribLocation(program,  "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);

		var tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW);
	
		var tPosition = gl.getAttribLocation(program, "vTexCoord");
		gl.vertexAttribPointer(tPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(tPosition);

		//Rotate current model counter clockwise, as the node gets lower in the tree, the faster it rotates
		viewMatrix = mult(viewMatrix, rotateY(theta *  Math.pow(2, getNodeUpwardHeight(this)/3)));
		gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));
		gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);

		stack.push(viewMatrix);
		//Render shadows if desired
		if(isShadows){
			gl.uniform1f(gl.getUniformLocation(program, "isShadow"), 1.0);
			//Variables for adjusting the position of the shadow
			let xAdjustment, yAdjustment, zAdjustment;
			let temp =  mult(viewMatrix, vec4(0.0, 0.0, 0.0, 1.0));
			let thisXCoords = temp[0];
			yAdjustment = temp[1];
			//Control how far and large the shadows appear
			let shadowSize = 20.0;

			//Adjust the X and Z positon depending on where the current model is
			if (thisXCoords == 0) {
				zAdjustment = -shadowSize;
				xAdjustment = 0;
			} else if (thisXCoords < 0) {
				zAdjustment = (shadowSize + thisXCoords) / ((thisXCoords / lightPosition[2]) - 1);
				xAdjustment = -1 * zAdjustment - shadowSize;
			} else {
				zAdjustment = (thisXCoords - shadowSize) / ((thisXCoords / lightPosition[2]) + 1);
				xAdjustment = zAdjustment + shadowSize;
			}

			//Translate the shadows to correct position apply correct translation and rotation
			viewMatrix = translate(xAdjustment, yAdjustment-lightPosition[1], zAdjustment);
			viewMatrix = mult(viewMatrix, translate(lightPosition[0], lightPosition[1], lightPosition[2]));
			viewMatrix = mult(viewMatrix, m);
			viewMatrix = mult(viewMatrix, translate(-lightPosition[0], -lightPosition[1], -lightPosition[2]));
			viewMatrix = mult(viewMatrix, rotateY(theta));
			gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));
			gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
		}
		viewMatrix = stack.pop();

		gl.uniform1f(gl.getUniformLocation(program, "isShadow"), 0.0);

		//Number of nodes above the current node
		let topDistance = getNodeUpwardHeight(this);

		viewMatrix = mult(viewMatrix, rotateY(rotateDir * theta *  Math.pow(4, getNodeUpwardHeight(this))));
		let rotateChildren = (theta *  Math.pow(3, getNodeUpwardHeight(this)));
		
		//Render all of the children to the left of the current node
		//These children will be translated down and to the left of the current node
		//And set to rotate in a certain direction depending on what level of the tree it is on
		stack.push(viewMatrix);
		if(this.lChild != null){
			viewMatrix = mult(viewMatrix, translate(parentNode.width * -seperationAmount/topDistance, -seperationAmount * parentNode.width, 0));
			viewMatrix = mult(viewMatrix, rotateY(rotateChildren));
			gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));
			this.lChild.draw();
		}
		viewMatrix = stack.pop();
		
		//Repeat the same process for the nodes on the right of the tree
		stack.push(viewMatrix);
		if(this.rChild != null){
			viewMatrix = mult(viewMatrix, translate(parentNode.width * seperationAmount/topDistance, -seperationAmount * parentNode.width, 0));
			viewMatrix = mult(viewMatrix, rotateY(rotateChildren));
			gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));
			this.rChild.draw();
		}
		viewMatrix = stack.pop();

		//Draw the lines connecting the current node to those below it
		this.drawLines();
	}

	//This handles the drawing of lines between models from a higher tier to those below it
	//Each line will only be drawn if there is a model to connect to it
	drawLines(){
		let lines = [];
		let lineColors = [];
		let topDistance = getNodeUpwardHeight(this);
		createATexture(colors.white);
		//Only render a line if there is a model to connect to
		if(this.rChild != null){
			lines.push(vec4(this.centerX, this.centerY, 0.0, 1.0), vec4(this.centerX, -seperationAmount/2, 0.0, 1.0), vec4(this.centerX, -seperationAmount/2, 0.0, 1.0), vec4(parentNode.width*seperationAmount/topDistance, -seperationAmount/2, 0.0, 1.0), vec4(parentNode.width*seperationAmount/topDistance, -seperationAmount/2, 0.0, 1.0), vec4(parentNode.width*seperationAmount/topDistance, -parentNode.height*seperationAmount, 0.0, 1.0));
			lineColors.push(colors.white, colors.white, colors.white, colors.white, colors.white, colors.white);
		}

		if(this.lChild != null){
			lines.push(vec4(this.centerX, this.centerY, 0.0, 1.0), vec4(this.centerX, -seperationAmount/2, 0.0, 1.0), vec4(this.centerX, -seperationAmount/2, 0.0, 1.0), vec4(-parentNode.width*seperationAmount/topDistance, -seperationAmount/2, 0.0, 1.0), vec4(-parentNode.width*seperationAmount/topDistance, -seperationAmount/2, 0.0, 1.0), vec4(-parentNode.width*seperationAmount/topDistance, -parentNode.height*seperationAmount, 0.0, 1.0));
			lineColors.push(colors.white, colors.white, colors.white, colors.white, colors.white, colors.white);
		}

		//Render Lines
		let pBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(lines), gl.DYNAMIC_DRAW);

		let vPosition = gl.getAttribLocation(program,  "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		let cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(lineColors), gl.DYNAMIC_DRAW);

		let vColor= gl.getAttribLocation(program,  "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		
		gl.uniformMatrix4fv(modelView, false, flatten(viewMatrix));

		gl.drawArrays(gl.LINES, 0, lines.length);
	}

	//Set the normals to normals neeeded for Gourand lighting
	gourand(){
		this.normals = getGourandNormals(this.vertices);
		if(this.lChild != null)
			this.lChild.gourand();
		if(this.rChild != null)
			this.rChild.gourand();
	}

	//Set the normals to normals neeeded for flat lighting
	flat(){
		this.normals = getNormals(this.vertices);
		if(this.lChild != null)
			this.lChild.flat();
		if(this.rChild != null)
			this.rChild.flat();
	}
}