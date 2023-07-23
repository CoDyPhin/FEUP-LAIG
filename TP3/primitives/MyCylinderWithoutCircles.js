class MyCylinderWithoutCircles extends CGFobject {

    constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
      super(scene);
      this.stacks = stacks;
      this.slices = slices;
      this.bottomRadius = bottomRadius;
      this.topRadius = topRadius;
      this.height = height;
  
      this.initBuffers();
    }
  
  
    initBuffers() {
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords=[];
  
      var ang = 2*Math.PI/this.slices;
      
      for (var i = 0; i <= this.stacks; i++) {
        for (var j = 0; j < this.slices; j++) {
          this.vertices.push(
            Math.cos(j * ang) * ((this.stacks - i) * (this.bottomRadius - this.topRadius) / (this.stacks) + this.topRadius),
            Math.sin(j * ang) * ((this.stacks - i) * (this.bottomRadius - this.topRadius) / (this.stacks) + this.topRadius),
            i / this.stacks * this.height);
  
          this.normals.push(Math.cos(j * ang),  Math.sin(j * ang), 0);
  
          this.texCoords.push(j / this.slices, i / this.stacks);
        }
      }
  
      for (var i = 0; i < this.stacks; i++) {
        for (j = 0; j < this.slices-1; j++) {
            this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
            this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
        }
  
        this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
        this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
      }
  
      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
    }
  
    display() {
      CGFobject.prototype.display.call(this);
    }
}