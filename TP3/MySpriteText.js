class MySpriteText extends MySpriteSheet{
    constructor(scene, text){
        super(scene, null, 16, 16);
        this.text = text;
        this.texture = new CGFtexture(this.scene, "./scenes/images/berlinspritesheet.png");
        this.initBuffers();
        
    }

    initBuffers(){
        this.charsquares = [];
        for (let i = 0; i < this.text.length; i++){
            this.charsquares.push(new MyRectangle(this.scene, 0,0,0.5,0.5));
        }
    }

    setText(text){
        this.text = text;
    }

    getCharacterPosition(character){
        this.activateCellP(character.charCodeAt(0));
    }

    display(){
        this.scene.gl.enable(this.scene.gl.BLEND);         // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);
        this.scene.pushMatrix();
        this.scene.setActiveShaderSimple(this.shader);
        this.texture.bind();
        for (let i = 0; i < this.charsquares.length; i++){
            this.getCharacterPosition(this.text[i]);
            this.charsquares[i].display();
            this.scene.translate(0.3,0,0);
        }
        this.texture.unbind();
        this.scene.popMatrix();
        this.scene.setActiveShaderSimple(this.defaultShader);
        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.depthMask(true);
    }
}
