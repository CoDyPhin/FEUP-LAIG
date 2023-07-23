class Patch extends CGFobject{
	constructor(scene,nPointsU,nPointsV,nPartsU,nPartsV,controlPoints){
		super(scene);
		this.nPointsU = nPointsU;
		this.nPointsV = nPointsV;
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.controlPoints = [];

		var index = 0;

		for (var i = 0; i < nPointsU; i++) {
			var points = [];
			for (var j = 0; j < nPointsV; j++) {
				points.push(controlPoints[index]);
				index++;
			}
			this.controlPoints.push(points);
		}
		this.nurbsSurface = new CGFnurbsSurface(this.nPointsU-1,this.nPointsV-1,this.controlPoints);

		this.nurbsObject = new CGFnurbsObject(this.scene,this.nPartsU,this.nPartsV,this.nurbsSurface);
	
	}


	display(){
		this.nurbsObject.display();
	}

	amplifyTexture(afs,aft){

	}
}