/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

class MyGraphLeaf {
    constructor(graph, obj){
        this.graph = graph;
        this.primitive = null;

        this.type = obj[0];

        switch (this.type) {
            case 'rectangle':
                this.primitive = new MyRectangle(this.graph.scene, obj[1], obj[2], obj[3], obj[4]);
                break;
            case 'triangle':
                this.primitive = new MyTriangle(this.graph.scene, obj[1], obj[2], obj[3], obj[4], obj[5], obj[6]);
                break;
            case 'cylinder':
                this.primitive = new MyCylinder(this.graph.scene, obj[1], obj[2], obj[3], obj[4], obj[5]);
                break;
            case 'cylinderWithoutCircles':
                this.primitive = new MyCylinderWithoutCircles(this.graph.scene, obj[1], obj[2], obj[3], obj[4], obj[5]);
                break;
            case 'sphere':
                this.primitive = new MySphere(this.graph.scene, obj[1], obj[2], obj[3]);
                break;
            case 'torus':
                this.primitive = new MyTorus(this.graph.scene, obj[1], obj[2], obj[3], obj[4]);
                break;
            case 'spritetext':
                this.primitive = new MySpriteText(this.graph.scene, obj[1]);
                break;
            case 'spriteanim':
                this.primitive = new MySpriteAnimation(this.graph.scene, obj[1], obj[2], obj[3], obj[4], obj[5], obj[6]);     
                break;
            case 'plane':
                this.primitive = new Plane(this.graph.scene, obj[1], obj[2]);
                break;
            case 'patch':
                this.primitive = new Patch(this.graph.scene, obj[1], obj[2], obj[3], obj[4], obj[5]);
                break;
            case 'defbarrel':
                this.primitive = new DefBarrel(this.graph.scene, obj[1], obj[2], obj[3], obj[4], obj[5]);
                break;
            default:
                break;
        }
    }


    display(){
        this.primitive.display();
    }

    amplifyTex(afs, aft) {
        if(this.type == 'rectangle' || this.type == 'triangle' || this.type == 'plane')
            this.primitive.amplifyTexture(afs, aft);
        if(!(this.type == 'spritetext' || this.type == 'spriteanim'))   
		    this.primitive.updateTexCoordsGLBuffers();
    }
}