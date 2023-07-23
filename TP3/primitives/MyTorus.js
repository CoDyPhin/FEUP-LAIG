class MyTorus extends CGFobject{

    constructor(scene, inner, outer, slices, loops){

        super(scene);

        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var i = 0; i <= this.loops; i++) {
            var theta = 2* i * Math.PI / this.loops;
            for (var j = 0; j <= this.slices; j++) {

                var phi = j * 2 * Math.PI / this.slices;


                var x = (this.outer + (this.inner * Math.cos(theta))) * Math.cos(phi);
                var y = (this.outer + (this.inner * Math.cos(theta))) * Math.sin(phi);
                var z = this.inner * Math.sin(theta);
                var s = (i / this.loops);
                var t = (j / this.slices);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(t, s);
            }
        }

        for (var i = 0; i < this.loops; i++) {
            for (var j = 0; j < this.slices; j++) {

                var a = (i * (this.slices + 1)) + j;
                var b = a + this.slices + 1;

                this.indices.push(a, b + 1, b);
                this.indices.push(a, a + 1, b + 1);
            }
        }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
	};
}
