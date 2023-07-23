class MySphere extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.stacks = stacks * 2;
    this.slices = slices;
    this.radius = radius;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phiInc = Math.PI / this.stacks;
    var thetaInc = (2 * Math.PI) / this.slices;
    var latVertices = this.slices + 1;
    
    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.stacks; latitude++) {
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let longitude = 0; longitude <= this.slices; longitude++) {
        //--- Vertices coordinates
        var x = Math.cos(theta) * sinPhi;
        var y = cosPhi;
        var z = Math.sin(-theta) * sinPhi;
        this.vertices.push(this.radius * x, this.radius * y, this.radius * z);

        //--- Indices
        if (latitude < this.stacks && longitude < this.slices) {
          var current = latitude * latVertices + longitude;
          var next = current + latVertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)
          
          this.indices.push( current + 1, current, next);
          this.indices.push( current + 1, next, next +1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to 
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vectro
        this.normals.push(x, y, z);
        theta += thetaInc;

        //--- Texture Coordinates
        this.texCoords.push(-3.02*Math.PI + longitude / this.slices, latitude / this.stacks);
        
      }
      phi += phiInc;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.scene.pushMatrix();
    if (this.scene.displayEarth == true)  
      this.scene.sceneMaterial.apply();
    //this.scene.defaultMaterial.apply();
    this.scene.popMatrix();
    super.display();
   }

   amplifyTexture(amplifierS, amplifierT) {
		for (let i = 0; i < this.texCoords.length; i += 2) {
			this.texCoords[i] = this.texCoords[i] / amplifierS;
			this.texCoords[i + 1] = this.texCoords[i + 1] / amplifierT;
		}
	
		this.updateTexCoordsGLBuffers();
	};
}