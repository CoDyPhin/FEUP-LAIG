/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
    constructor(scene, x1, y1, x2, y2, x3, y3) {
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0,    //0
            this.x2, this.y2, 0,    //1
            this.x3, this.y3, 0    //2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]

		var a = Math.sqrt(Math.pow((this.x2-this.x1),2) + Math.pow((this.y2-this.y1),2));
        var b = Math.sqrt(Math.pow((this.x3-this.x2),2) + Math.pow((this.y3-this.y2),2));
        var c = Math.sqrt(Math.pow((this.x1-this.x3),2) + Math.pow((this.y1-this.y3),2));
        var alpha = Math.acos((Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2))/(2*a*c));

		this.T1x = 0;
		this.T1y = 1;
		this.T2x = a;
		this.T2y = 1;
        this.T3x = c*Math.cos(alpha);
        this.T3y = c*Math.sin(alpha); 

        this.texCoords = [
            this.T1x, this.T1y,
            this.T2x, this.T2y,
            this.T3x, 1-this.T3y
        ]

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    amplifyTexture(afs,aft){
		this.texCoords = [
            this.T1x, this.T1y,
            this.T2x/afs, this.T2y,
            this.T3x/afs, 1-this.T3y/aft
        ]
        this.updateTexCoordsGLBuffers();
    }
}