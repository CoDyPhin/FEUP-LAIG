class MyGraphNode {
    constructor(graph, nodeID){
        this.graph = graph;
        this.nodeId = nodeID;

        this.children = [];
        this.leaves = [];
        this.material = null;
        this.texture = null;
        this.afs = null;
        this.aft = null;
        this.alreadyAmplified = false;

        this.transformMatrix = mat4.create();
        mat4.identity(this.transformMatrix);
    }

    addChild(nodeID){
        this.children.push(nodeID);
    }

    addLeaf(leaf) {
        this.leaves.push(leaf);
    }

    display(material, texture) {
        this.graph.scene.pushMatrix();
        this.graph.scene.multMatrix(this.transformMatrix);

        var mat = material;
        var tex = texture;

        if (this.material != null)
            mat = this.material;


        if (this.texture != null){
            if (this.texture == "clear")
                tex = null;
            else
                tex = this.texture;
        }

        // Displays leaves
        for (var i = 0; i < this.leaves.length; i++){
            if (!this.alreadyAmplified && this.afs != 0 && this.aft != 0){
                this.leaves[i].amplifyTex(this.afs, this.aft);
                this.alreadyAmplified = true;
            }
            
            if (tex != null){
                mat.setTexture(tex[0]);
            }
            else
                mat.setTexture(null);

            if (mat != null){
                mat.setTextureWrap('MIRRORED_REPEAT', 'MIRRORED_REPEAT');
                mat.apply();
            }

            this.leaves[i].display();
        }

        // Displays nodes 
        for(var i=0; i<this.children.length; i++){
            if (this.graph.nodes[this.children[i]] != null) this.graph.nodes[this.children[i]].display(mat, tex);
            else this.graph.onXMLMinorError("undefined node " + this.graph.nodes[this.children[i]]);
        }
        
        this.graph.scene.popMatrix();
    }
}
