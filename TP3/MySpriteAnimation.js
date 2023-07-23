class MySpriteAnimation{
	constructor(scene,spriteSheet,duration,startCell,endCell){
		this.scene = scene;
		this.spriteSheet = spriteSheet;
		this.duration = duration;
		this.startCell = startCell;
		this.endCell = endCell;
		this.lastTime = 0;
		this.spriteSheet.activateCellP(this.startCell);
		this.currentCell = this.startCell;
		this.transitionTime = this.duration*1000/(this.endCell-this.startCell);
		this.surface = new MyRectangle(this.scene,0,0,1,1);
		this.surface2 = new MyRectangle(this.scene,0,0,1,1);
		this.displayAnim = false;
	}

	update(t){
		if(this.currentCell == this.endCell){
			this.spriteSheet.activateCellP(this.currentCell);
			this.currentCell = 0;
			return;
		}

		if((t-this.lastTime) >= this.transitionTime){
			this.currentCell++;
			this.spriteSheet.activateCellP(this.currentCell);
			this.lastTime = t;
		}
	}

	display(){
		this.scene.gl.enable(this.scene.gl.BLEND);         // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);
		this.scene.pushMatrix();
		this.scene.setActiveShaderSimple(this.spriteSheet.shader);
		this.spriteSheet.texture.bind();
		if (this.displayAnim){
			this.surface.display();
			this.scene.pushMatrix();
			this.scene.translate(1,0,0);
			this.scene.rotate(Math.PI, 0, 1 ,0);
			this.surface2.display();
			this.scene.popMatrix();
		}
		this.spriteSheet.texture.unbind();
		this.scene.setActiveShaderSimple(this.scene.defaultShader);
		this.scene.popMatrix();
		this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.gl.depthMask(true);
	}
}
