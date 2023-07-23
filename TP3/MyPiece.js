class MyPiece extends CGFobject {
    constructor(scene, type, tile) {
        super(scene);
        this.type = type;
        this.tile = tile;   
        this.object = new MyModel(scene);
        
    }

    getType() {
        return this.type;
    }

    setTile(tile) {
        this.tile = tile;
    }

    getTile() {
        return this.tile;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.2,0.2,0.2);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.translate(0,0,1.5);
        switch(this.type){
            case "plyr1":
                this.scene.graph.materials["White"].setTexture(null);
                this.scene.graph.materials["White"].apply();
                break;
            case "plyr2":
                this.scene.graph.materials["Black"].setTexture(null);
                this.scene.graph.materials["Black"].apply();
                break;
            default:
                break;
        }

        this.object.display();
        this.scene.popMatrix();
    }
}