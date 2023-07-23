/**
 * MyTile
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTile extends CGFobject {
    constructor(scene, X, Y, board, piece, mat) {
        super(scene);
        this.col = X;
        this.row = Y;
        this.board = board;
		this.piece = piece;
        this.material = mat;
        this.tile = new Plane(this.scene, 1, 1);
        if (this.piece != null) this.piece.setTile(this);

        //this.tile = new MyRectangle(scene,0,0,5,5);
    }

    removePiece(){
        this.piece = null;
    }
    
    addPiece(type){
        this.piece = new MyPiece(this.scene, type, this);
    }

    setPiece(piece) {
        if (this.piece == null)
            this.piece = piece;
    }

    getPiece() {
        return this.piece;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.col, 0, this.row);
        this.scene.translate(0, 0, -5);
        if (this.piece == null) {
            this.scene.registerForPick(this.col * 10 + this.row, this);
        }
        else {
            this.scene.registerForPick(this.col * 10 + this.row, this.getPiece());
            this.piece.display();
        }
        if (this.material == null){
            this.material = this.scene.graph.materials['defaultMaterial'];
        }

        if (this.row < 2){
            this.material.setTexture(this.scene.graph.textures['woodTex'][0]);
        }

        this.material.setTexture(null);
        this.material.apply();

        this.tile.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
    }

}