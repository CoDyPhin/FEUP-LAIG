class MyModel extends CGFobject {
    constructor(scene) {
        super(scene);
        this.topSide = new MyCylinder(this.scene, 0.5, 0.4, 2, 20, 3);
        this.botSide = new MyCylinder(this.scene, 1.2, 0.9, 1, 20, 3);
        this.botCil = new MyCylinder(this.scene, 1.2, 1.2, 0.15, 20, 3);
        this.top = new MySphere(this.scene, 0.8, 64,64);
        this.bot = new MySphere(this.scene, 1.2 , 64,64);
        this.ring = new MyTorus(this.scene, 1, 4, 64,64);
    }

    display() {
        this.scene.pushMatrix();
        this.topSide.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,2);
        this.top.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.15,0.15,0.15);
        this.scene.translate(0,0,7.5);
        this.ring.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,-1);
        this.botSide.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1,1,0.2);
        this.scene.translate(0,0,-5);
        this.bot.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,-1.3);
        this.botCil.display();
        this.scene.popMatrix();
    }
}