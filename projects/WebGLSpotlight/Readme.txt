Brian Earl

My program is set up into two files: index.html and index.js

index.html is the main html page that is used for user interaction, not only file submission but also input detection for the keyboard and mouse.
Certain methods are called in index.js depending on which button is pressed or elements are manipulated (i.e. uploading a file) 
The bulk of the code is present in index.js which contains methods that index.html calls.

index.js contains the methods called by index.html that handle drawing the image to the screen and manipulating them.
There are several variables and methods and a class contained in this file
	-Most notably, there is a class called "node" which represents a node within a binary tree. Each node contains a lists of vertices, the normal
	 vectors of the vertices, the color to draw in, a child to be placed on the left and right, and the extents of the node's model. 
	 Each node also contains functions for adding chidren, rendering the current node and all of children of the current node, drawing lines between the 
	 current node and its immediate children, and setting the normals of all the nodes for either flat or Gourand lighting. 
	 The mobile is then constructing as a binary tree using the node class and the draw() function is classed of the top most parent node which then 
	 draws the whole mobile.
	-spotLightSize is a variable which keeps track of how large the current spot size is and which is then sent to the shader
	-lightPosition, lightAmbient, lightDiffuse, lightSpecular, materialAmbient, materialDiffuse, materialSpecular and materialShininess which are all
	 variables which are used to control how light interacts with the current scene
	-colors which is a list of premade instances of colors that can be called
	-getNormals() and getGourandNormals() are functions that are used to calculate the normals for a given list of vertices. getNormals() caclulates the
	 normals needed for flat shaping and getGourandNormals() gets calculates the normals needed for Gourand shading.

The program does not use .ply files for the shapes and instead generates the shapes with code.

The spotlight in the scene is located slightly above and to the left of the top most cube.