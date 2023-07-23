class MySpriteSheet{
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.path = texture;
        if(texture !=null) this.texture = new CGFtexture(this.scene, texture);
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.shader = new CGFshader(this.scene.gl, "shaders/sprite.vert", "shaders/sprite.frag");
        this.shader.setUniformsValues({uSampler: 0});
        this.shader.setUniformsValues({spriteSheetSize: [1/this.sizeM, 1/this.sizeN]});
        this.defaultShader = this.scene.defaultShader;
    }

    activateCellMN(m, n){
        this.shader.setUniformsValues({selectedSprite: [m,n]});
    }

    activateCellP(p){
        var row = Math.floor(p / this.sizeM);
        var col = Math.floor(p % this.sizeM);
        this.shader.setUniformsValues({selectedSprite: [col,row]});
    }

    update(t){}
}
