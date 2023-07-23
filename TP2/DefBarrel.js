class DefBarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices/2;
        this.stacks = stacks/2;

        var controlPointsTop = [
            [
                [-this.base,0,0,1],
                [-this.base,4*this.base/3,0,1],
                [this.base, 4*this.base/3,0,1],
                [this.base,0,0,1]
            ],

            [
                [-this.middle,0,this.height/2,1],
                [-this.middle,4/3*this.middle,this.height/2,1],
                [this.middle,4/3*this.middle,this.height/2,1],
                [this.middle,0,this.height/2,1]
            ],

            [
                [-this.base,0,this.height,1],
                [-this.base,4/3*this.base,this.height,1],
                [this.base,4/3*this.base,this.height,1],
                [this.base,0,this.height,1]       
            ]

        ];

        var controlPointsBot = [
            [
                [this.base,0,0,1],
                [this.base,-4*this.base/3,0,1],
                [-this.base,-4*this.base/3,0,1],
                [-this.base,0,0,1]
            ],

            [
                [this.middle,0,this.height/2,1],
                [this.middle,-4/3*this.middle,this.height/2,1],
                [-this.middle,-4/3*this.middle,this.height/2,1],
                [-this.middle,0,this.height/2,1]
            ],
    

    
            [
                [this.base,0,this.height,1],
                [this.base,-4/3*this.base,this.height,1],
                [-this.base,-4/3*this.base,this.height,1],
                [-this.base,0,this.height,1]       
            ]
    
        ];

        var nurbsSurface1 = new CGFnurbsSurface(2, 3, controlPointsTop);
		var nurbsSurface2 = new CGFnurbsSurface(2, 3, controlPointsBot);
		this.nurbs1 = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface1);
		this.nurbs2 = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface2);
    }

	display(){
		this.nurbs1.display();
		this.nurbs2.display();
    };
    
    updateTexCoords(afs, aft){

	};
}