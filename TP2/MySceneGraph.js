const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var ANIMATIONS_INDEX = 6;
var SPRITESHEETS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.cameras = [];

        this.camerasID = {};
        this.cameraIndex = 0;

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.animationsIDs = [];
        this.spriteSheets = [];
        this.spriteAnimationsIDs = [];
        this.spriteAnimations = [];
        
        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }
        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
        
        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }
        
        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse animations block
            if ((error = this.parseSpriteSheets(nodes[index])) != null)
                return error;
        }        

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');

        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;
        var nodeNames = [];

        var near = null;
        var far = null;
        var angle = null;
        var left = null;
        var right = null;
        var top = null;
        var bottom = null;

        var grandChildren = [];
        var grandChildrenNodeNames = [];
        
        var index = null;
        var from_Index = null;
        var to_Index = null;
        var up_Index = null;

        var f_x = null;
        var f_y = null;
        var f_z = null;

        var t_x = null;
        var t_y = null;
        var t_z = null;

        var u_x = null;
        var u_y = null;
        var u_z = null;
        
        var from = null;
        var to = null;
        var up = null;

        for (var i = 0; i < children.length; i++){
            nodeNames.push(children[i].nodeName);
        }

        if (nodeNames.length == 0){
            this.onXMLMinorError("undefined view");
        }


        for (var i = 0; i < children.length; i++){
            switch(nodeNames[i]){
                case 'perspective':
                    index = nodeNames.indexOf("perspective");
                    if (index == -1){
                        this.onXMLMinorError("undefined perspective");
                    }
                    else{
                        var cameraID = this.reader.getString(children[i], 'id');
                        this.perspective = children[i];
                        
                        near = this.reader.getFloat(this.perspective, 'near');
                        far = this.reader.getFloat(this.perspective, 'far');
                        angle = this.reader.getFloat(this.perspective, 'angle');

                        grandChildren = this.perspective.children;

                        for (var x = 0; x < grandChildren.length; x++){
                            grandChildrenNodeNames.push(grandChildren[x].nodeName);
                        }

                        from_Index = grandChildrenNodeNames.indexOf("from");
                        to_Index = grandChildrenNodeNames.indexOf("to");
                        
                        if (from_Index == -1){
                            this.onXMLMinorError("undefined position");
                        }
                        else if (to_Index == -1){
                            this.onXMLMinorError("undefined target");
                        }
                        else{
                            f_x = this.reader.getFloat(grandChildren[from_Index], 'x');
                            f_y = this.reader.getFloat(grandChildren[from_Index], 'y');
                            f_z = this.reader.getFloat(grandChildren[from_Index], 'z');

                            t_x = this.reader.getFloat(grandChildren[to_Index], 'x');
                            t_y = this.reader.getFloat(grandChildren[to_Index], 'y');
                            t_z = this.reader.getFloat(grandChildren[to_Index], 'z');
                        }

                        if (near == null || far == null || angle == null || f_x == null || f_y == null || f_z == null || t_x == null || t_y == null || t_z == null){
                            this.onXMLMinorError("null perspective values");
                        }
                        else if (isNaN(near) || isNaN(far) || isNaN(angle) || isNaN(f_x) || isNaN(f_y) || isNaN(f_z) || isNaN(t_x) || isNaN(t_y) || isNaN(t_z)){
                            this.onXMLMinorError("non numeric perspective values");
                        }
                        else{
                            from = [f_x, f_y, f_z];
                            to = [t_x, t_y, t_z];

                            this.perspective_camera = new CGFcamera(angle*Math.PI/180, near, far, from, to); 

                            if (this.perspective_camera == null)
                                console.log("null perspective camera");
                            else{
                                this.cameras.push(this.perspective_camera);
                                this.camerasID[cameraID] = this.cameraIndex;
                                this.cameraIndex++;
                            }
                        }
                    }
                    break;
                case 'ortho':
                    index = nodeNames.indexOf("ortho");
                    if (index == -1){
                        this.onXMLMinorError("undefined ortho");
                    }
                    else{
                        this.ortho = children[i];
                        cameraID = this.reader.getString(children[i], 'id');

                        near = this.reader.getFloat(this.ortho, 'near');
                        far = this.reader.getFloat(this.ortho, 'far');
                        left = this.reader.getFloat(this.ortho, 'left');
                        right = this.reader.getFloat(this.ortho, 'right');
                        top = this.reader.getFloat(this.ortho, 'top');
                        bottom = this.reader.getFloat(this.ortho, 'bottom');

                        grandChildren = this.ortho.children;
                    
                        grandChildrenNodeNames = [];
                        for (var x = 0; x < grandChildren.length; x++){
                            grandChildrenNodeNames.push(grandChildren[x].nodeName);
                        }

                        from_Index = grandChildrenNodeNames.indexOf("from");
                        to_Index = grandChildrenNodeNames.indexOf("to");
                        up_Index = grandChildrenNodeNames.indexOf("up");
                        
                        if (from_Index == -1){
                            this.onXMLMinorError("undefined position");
                        }
                        else if (to_Index == -1){
                            this.onXMLMinorError("undefined target");
                        }
                        else if (up_Index == -1){
                            f_x = this.reader.getFloat(grandChildren[from_Index], 'x');
                            f_y = this.reader.getFloat(grandChildren[from_Index], 'y');
                            f_z = this.reader.getFloat(grandChildren[from_Index], 'z');
                            
                            t_x = this.reader.getFloat(grandChildren[to_Index], 'x');
                            t_y = this.reader.getFloat(grandChildren[to_Index], 'y');
                            t_z = this.reader.getFloat(grandChildren[to_Index], 'z');

                            u_x = 0.0;
                            u_y = 1.0;
                            u_z = 0.0;
                        }
                        else{
                            f_x = this.reader.getFloat(grandChildren[from_Index], 'x');
                            f_y = this.reader.getFloat(grandChildren[from_Index], 'y');
                            f_z = this.reader.getFloat(grandChildren[from_Index], 'z');
                            
                            t_x = this.reader.getFloat(grandChildren[to_Index], 'x');
                            t_y = this.reader.getFloat(grandChildren[to_Index], 'y');
                            t_z = this.reader.getFloat(grandChildren[to_Index], 'z');

                            u_x = this.reader.getFloat(grandChildren[up_Index], 'x');
                            u_y = this.reader.getFloat(grandChildren[up_Index], 'y');
                            u_z = this.reader.getFloat(grandChildren[up_Index], 'z');
                        }

                        if (near == null || far == null || f_x == null || f_y == null || f_z == null || t_x == null || t_y == null || t_z == null || u_x == null || u_y == null || u_z == null){
                            this.onXMLMinorError("null ortho values");
                        }
                        else if (isNaN(near) || isNaN(far) || isNaN(f_x) || isNaN(f_y) || isNaN(f_z) || isNaN(t_x) || isNaN(t_y) || isNaN(t_z) || isNaN(u_x) || isNaN(u_y) || isNaN(u_z)){
                            this.onXMLMinorError("non numeric ortho values");
                        }
                        else{
                            from = [f_x, f_y, f_z];
                            to = [t_x, t_y, t_z];
                            up = [u_x, u_y, u_z];

                            this.ortho_camera = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);

                            if (this.ortho_camera == null)
                                console.log("null ortho camera");
                            else{
                                this.cameras.push(this.ortho_camera);
                                this.camerasID[cameraID] = this.cameraIndex;
                                this.cameraIndex++;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        this.scene.camera = this.cameras[0];
        this.scene.interface.setActiveCamera(this.cameras[0]);
        this.scene.interface.gui.add(this.scene, 'selectedCamera', this.camerasID).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));
        console.log("parsed views");

    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights.push(global);
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;
        var nodeNames = [];

        this.textures =  [];
        var numTextures = 0;

        for (var i = 0; i < children.length; i++){
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var textureId = this.reader.getString(children[i],'id');

            if (textureId == null){
                this.onXMLMinorError("undefined texture id");
            }
            else if (nodeNames.includes(textureId)){
                this.onXMLMinorError("texture id not unique");
            }
            else{
                nodeNames.push(textureId);
                
                var tex = new CGFtexture(this.scene, this.reader.getString(children[i], 'path'));

                this.textures[textureId] = [tex, textureId, this.reader.getString(children[i], 'path')];
                numTextures++;
            }

        }
        this.log("Parsed Textures");

        return null;

    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        
        this.materials = [];
        var numMaterials = 0;

        var grandChildren = [];
        var nodeNames = [];
        var grandChildrenNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            nodeNames.push(materialID);

            grandChildren = children[i].children;

            for (var x = 0; x < grandChildren.length; x++){
                grandChildrenNames.push(grandChildren[x].nodeName);
            }

            var shininessIndex = grandChildrenNames.indexOf("shininess");
            var ambientIndex = grandChildrenNames.indexOf("ambient");
            var diffuseIndex = grandChildrenNames.indexOf("diffuse");
            var specularIndex = grandChildrenNames.indexOf("specular");
            var emissiveIndex = grandChildrenNames.indexOf("emissive");

            var shininess = 0.0;
            var emissive_rgba = [];
            var ambient_rgba = [];
            var diffuse_rgba = [];
            var specular_rgba = [];

            if(shininessIndex == -1 || emissiveIndex == -1 || ambientIndex ==-1 || diffuseIndex ==-1 || specularIndex==-1){
                console.log("undefined nodes");
            }
            else{
                shininess = this.reader.getFloat(grandChildren[shininessIndex], 'value');
                
                ambient_rgba = this.parseColor(grandChildren[ambientIndex], 'undefined ambient component'); 
                diffuse_rgba = this.parseColor(grandChildren[diffuseIndex], 'undefined diffuse component');
                specular_rgba = this.parseColor(grandChildren[specularIndex], 'undefined specular component');
                emissive_rgba = this.parseColor(grandChildren[emissiveIndex], 'undefined emissive component');

            }
            
            var mat = new CGFappearance(this.scene);
            mat.setShininess(shininess);
            mat.setAmbient(ambient_rgba[0], ambient_rgba[1], ambient_rgba[2], ambient_rgba[3]);
            mat.setDiffuse(diffuse_rgba[0], diffuse_rgba[1], diffuse_rgba[2], diffuse_rgba[3]);
            mat.setSpecular(specular_rgba[0], specular_rgba[1], specular_rgba[2], specular_rgba[3]);
            mat.setEmission(emissive_rgba[0], emissive_rgba[1], emissive_rgba[2], emissive_rgba[3]);

            this.materials[materialID] = mat;

            numMaterials++;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
    * Parses the <animations> node.
    * @param {animations block element} animationsNode
    */
    parseAnimations(animationsNode){
        var children = animationsNode.children;

        this.animations = [];

        var grandChildren = [];

        // Any number of animations
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var animationId = this.reader.getString(children[i], 'id');
            var keyframes = [];

            if (animationId == null)
                return "no ID defined for animation";

            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            grandChildren = children[i].children;

            for(var j = 0; j<grandChildren.length; j++) {
                var instant = this.reader.getFloat(grandChildren[j], "instant");
                if (instant == null || isNaN(instant))
                    return "unable to parse inst of the animation for ID = " + animationId;

                var translationX = this.reader.getFloat(grandChildren[j].children[0], "x");
                if (translationX == null || isNaN(translationX))
                    return "unable to parse translation X movement of the animation for ID = " + animationId;

                var translationY = this.reader.getFloat(grandChildren[j].children[0], "y");
                if (translationY == null || isNaN(translationY))
                    return "unable to parse translation Y movement of the animation for ID = " + animationId;

                var translationZ = this.reader.getFloat(grandChildren[j].children[0], "z");
                if (translationZ == null || isNaN(translationZ))
                    return "unable to parse translation Z movement of the animation for ID = " + animationId;
                
                var translations = [translationX, translationY, translationZ];

                var rotationX, rotationY, rotationZ;

                for (var x = 0; x < 3; x++){
                    var axis = this.reader.getString(grandChildren[j].children[x+1], "axis");
                    switch(axis){
                        case 'x':
                            rotationX = this.reader.getFloat(grandChildren[j].children[x+1], "angle");
                            break;
                        case 'y':
                            rotationY = this.reader.getFloat(grandChildren[j].children[x+1], "angle");
                            break;
                        case 'z':
                            rotationZ = this.reader.getFloat(grandChildren[j].children[x+1], "angle");
                            break;
                    }
                }

                if (rotationX == null || rotationY == null || rotationZ == null || rotationX == null || rotationY == null || rotationZ == null)
                    return "undefined animation rotation";

                var rotations = [rotationX, rotationY, rotationZ];
                
                var scaleX = this.reader.getFloat(grandChildren[j].children[4], "sx");
                if (scaleX == null || isNaN(scaleX))
                    return "unable to parse scale X movement of the animation for ID = " + animationId;

                var scaleY = this.reader.getFloat(grandChildren[j].children[4], "sy");
                if (scaleY == null || isNaN(scaleY))
                    return "unable to parse scale Y movement of the animation for ID = " + animationId;

                var scaleZ = this.reader.getFloat(grandChildren[j].children[4], "sz");
                if (scaleZ == null || isNaN(scaleZ))
                    return "unable to parse scale Z movement of the animation for ID = " + animationId;
                
                var scales = [scaleX, scaleY, scaleZ];

                var keyFrame = new KeyFrame(instant, translations, rotations, scales);
                keyframes.push(keyFrame);

            }
            this.animations[animationId] = new KeyFrameAnimation(this.scene, animationId, keyframes);
            this.animationsIDs.push(animationId);
        }
    }

    parseSpriteSheets(spriteSheetsNode){
        var children = spriteSheetsNode.children;

        for (let i = 0; i < children.length; i++) {
            if(children[i].nodeName != "spritesheet"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            var spriteSheetID = this.reader.getString(children[i],'id');
            if(spriteSheetID == null){
                return "Invalid spritesheet ID"
            }
            if(this.spriteSheets[spriteSheetID] != null)
                return "ID must be unique for each spritesheet (conflict: ID = " + spriteSheetID + ")";
            var spriteSheet = new MySpriteSheet(this.scene,this.reader.getString(children[i],'path'),this.reader.getString(children[i],'sizeM'),this.reader.getString(children[i],'sizeN'));
            this.spriteSheets[spriteSheetID] = spriteSheet; 
        }
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
    var children = nodesNode.children;

    this.nodes = [];

    var grandChildren = [];
    var nodeNames = [];

    // Any number of nodes.
    for (var i = 0; i < children.length; i++) {
        
        if (children[i].nodeName != "node") {
            this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            continue;
        }

        // Get id of the current node.
        var nodeID = this.reader.getString(children[i], 'id');
        if (nodeID == null)
            return "no ID defined for nodeID";
        
        // Checks for repeated IDs. 
        if (this.nodes[nodeID] != null)
            return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

        // Creates node.
        this.nodes[nodeID] = new MyGraphNode(this, nodeID);

        grandChildren = children[i].children;
        nodeNames = [];

        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
        }

        // Textures
        var textureIndex = nodeNames.indexOf("texture");
        if (textureIndex == -1)
            return "texture index undefined";
        var textureId = this.reader.getString(grandChildren[textureIndex], 'id');

        if (textureId == null){
            return "undefined texture id";
        }   
        if (textureId != "null" && this.textures[textureId] == null && textureId != "clear")
            return "invalid texture id";

        var texChildren = grandChildren[textureIndex].children;
        var texChildrenNodeNames = [];


        for(var j=0;j<texChildren.length;j++) {
            texChildrenNodeNames.push(texChildren[j].nodeName);
        }

        var amplificationIndex = texChildrenNodeNames.indexOf("amplification");
        if (amplificationIndex != -1){
            var afs = this.reader.getFloat(texChildren[amplificationIndex], 'afs');
            var aft = this.reader.getFloat(texChildren[amplificationIndex], 'aft');

            this.nodes[nodeID].afs = afs;
            this.nodes[nodeID].aft = aft;
        }
        else{
            this.nodes[nodeID].afs = 1;
            this.nodes[nodeID].aft = 1; 
        }
        
        if (textureId == "clear"){
            this.nodes[nodeID].texture = "clear";
        }
        else
            this.nodes[nodeID].texture = this.textures[textureId];

        // Materials
        var materialIndex = nodeNames.indexOf("material");
        if (materialIndex == -1)
            return "material index undefined";
        var materialID = this.reader.getString(grandChildren[materialIndex], 'id');

        if (materialID == null){
            return "undefined material id"
        }
        if (materialID != "null" && this.materials[materialID] == null)
            return "invalid material id";
        
        this.nodes[nodeID].material = this.materials[materialID];

        var animationIndex = nodeNames.indexOf("animationref");
        if (animationIndex != -1){
            var animationID = this.reader.getString(grandChildren[animationIndex], 'id');

            if (animationID == null){
                return "undefined material id"
            }
            if (animationID != "null" && this.animations[animationID] == null)
                return "invalid material id";
            
            this.nodes[nodeID].animation = this.animations[animationID];
        }
        // Transformations
        var transformationsIndex = nodeNames.indexOf("transformations");
        var transformationsNodeNames = grandChildren[transformationsIndex].children;
        
        var x = null;
        var y = null;
        var z = null;

        var axis = null;
        var angle = null;

        var sx = null;
        var sy = null;
        var sz = null;
        
        for (var j = 0; j < transformationsNodeNames.length; j++){
            var transformationType = transformationsNodeNames[j].nodeName;
            switch(transformationType){
                case 'translation':
                    x = this.reader.getFloat(transformationsNodeNames[j], 'x');
                    y = this.reader.getFloat(transformationsNodeNames[j], 'y');
                    z = this.reader.getFloat(transformationsNodeNames[j], 'z');

                    if (x == null || y== null || z == null || isNaN(x) || isNaN(y) || isNaN(z))
                        return "undefined translation";

                    mat4.translate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [x,y,z]);
                    break;
                case 'rotation':
                    axis = this.reader.getItem(transformationsNodeNames[j], 'axis', ['x', 'y', 'z']);
                    angle = this.reader.getFloat(transformationsNodeNames[j], 'angle');

                    if (axis == null || angle == null || isNaN(angle))
                        return "undefined rotation";

                    mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, angle*Math.PI/180.0, this.axisCoords[axis]);
                    break;
                case 'scale':
                    sx = this.reader.getFloat(transformationsNodeNames[j], 'sx');
                    sy = this.reader.getFloat(transformationsNodeNames[j], 'sy');
                    sz = this.reader.getFloat(transformationsNodeNames[j], 'sz');

                    if (sx == null || sy == null || sz == null || isNaN(sx) || isNaN(sy) || isNaN(sz))
                        return "undefined scale";

                        mat4.scale(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [sx, sy, sz]);
                    break;
                default:
                    break;
            }
        }

        // Descendants
        var descendantsIndex = nodeNames.indexOf("descendants");
        if (descendantsIndex == -1)
            return "intermediate node without descendants";

        var descendantsNodeNames = grandChildren[descendantsIndex].children;

        var temp = [];
        var x1 = null;
        var y1 = null;
        var x2 = null;
        var y2 = null;
        var x3 = null;
        var y3 = null;
        var botRad = null;
        var topRad = null;
        var height = null;
        var slices = null;
        var stacks = null;
        var radius = null;
        var innerRad = null;
        var outerRad = null;
        var loops = null;
        var string = null;
        var ssid = null;
        var duration = null;
        var startcell = null;
        var endcell = null;

        for (var k = 0; k < descendantsNodeNames.length; k++){
            if (descendantsNodeNames[k].nodeName == "noderef"){
                var descId = this.reader.getString(descendantsNodeNames[k], 'id');

                if(descId==null)
                    return "Undefined ID for descendant";
                else if(descId==nodeID)
                    return "Node can't be it's own descendant";

                this.nodes[nodeID].addChild(descId);
            }
            else if (descendantsNodeNames[k].nodeName == "leaf"){
                var descendantType = this.reader.getString(descendantsNodeNames[k], 'type', ['triangle', 'rectangle', 'cylinder', 'sphere', 'torus', 'spriteAnim', 'spriteText', 'plane', 'patch']);
                switch(descendantType){
                    case 'rectangle':
                        x1 = this.reader.getFloat(descendantsNodeNames[k], 'x1');
                        y1 = this.reader.getFloat(descendantsNodeNames[k], 'y1');
                        x2 = this.reader.getFloat(descendantsNodeNames[k], 'x2');
                        y2 = this.reader.getFloat(descendantsNodeNames[k], 'y2');

                        if (x1 == null || y1 == null || x2 == null || y2 == null || isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
                            return 'undefined rectangle';

                        temp = [descendantType, x1, y1, x2, y2];
                        break;
                    case 'cylinder':
                        botRad = this.reader.getFloat(descendantsNodeNames[k], 'bottomRadius');
                        topRad = this.reader.getFloat(descendantsNodeNames[k], 'topRadius');
                        height = this.reader.getFloat(descendantsNodeNames[k], 'height');
                        slices = this.reader.getFloat(descendantsNodeNames[k], 'slices');
                        stacks = this.reader.getFloat(descendantsNodeNames[k], 'stacks');

                        if (botRad == null || topRad == null || height == null || slices == null || stacks == null || isNaN(botRad) || isNaN(topRad) || isNaN(height) || isNaN(slices) || isNaN(stacks))
                            return 'undefined cylinder';

                        temp = [descendantType, botRad, topRad, height, slices, stacks];
                        break;
                    case 'triangle':
                        x1 = this.reader.getFloat(descendantsNodeNames[k], 'x1');
                        y1 = this.reader.getFloat(descendantsNodeNames[k], 'y1');
                        x2 = this.reader.getFloat(descendantsNodeNames[k], 'x2');
                        y2 = this.reader.getFloat(descendantsNodeNames[k], 'y2');
                        x3 = this.reader.getFloat(descendantsNodeNames[k], 'x3');
                        y3 = this.reader.getFloat(descendantsNodeNames[k], 'y3');

                        if (x1 == null || y1 == null || x2 == null || y2 == null || x3 == null || y3 == null || isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(x3) || isNaN(y3))
                            return 'undefined triangle';

                        temp = [descendantType, x1, y1, x2, y2, x3, y3];
                        break;
                    case 'sphere':
                        radius = this.reader.getFloat(descendantsNodeNames[k], 'radius');
                        slices = this.reader.getFloat(descendantsNodeNames[k], 'slices');
                        stacks = this.reader.getFloat(descendantsNodeNames[k], 'stacks');

                        if (radius == null || slices == null || stacks == null || isNaN(radius) || isNaN(slices) || isNaN(stacks))
                            return 'undefined sphere';
                        
                        temp = [descendantType, radius, slices, stacks];
                        break;
                    case 'torus':
                        innerRad = this.reader.getFloat(descendantsNodeNames[k], 'inner');
                        outerRad = this.reader.getFloat(descendantsNodeNames[k], 'outer');
                        slices = this.reader.getFloat(descendantsNodeNames[k], 'slices');
                        loops = this.reader.getFloat(descendantsNodeNames[k], 'loops');

                        if (innerRad == null || outerRad == null || slices == null || loops == null || isNaN(innerRad) || isNaN(outerRad) || isNaN(slices) || isNaN(loops))
                            return 'undefined torus';

                        temp = [descendantType, innerRad, outerRad, slices, loops];
                        break;
                    case 'spritetext':
                        string = this.reader.getString(descendantsNodeNames[k], 'text');
                        if(string == null) return 'undefined spritetext';
                        temp = [descendantType, string];
                        break;
                    case 'spriteanim':
                        ssid = this.reader.getString(descendantsNodeNames[k], 'ssid');
                        var spriteS = this.spriteSheets[ssid];
                        if(spriteS == null) return 'spritesheet not defined';
                        
                        duration = this.reader.getFloat(descendantsNodeNames[k], 'duration');
                        startcell = this.reader.getFloat(descendantsNodeNames[k], 'startCell');
                        endcell = this.reader.getFloat(descendantsNodeNames[k], 'endCell');
                        temp = [descendantType, spriteS, duration, startcell, endcell];

                        var spriteAnimation = new MySpriteAnimation(this.scene,this.spriteSheets[ssid],duration,startcell,endcell);
                        this.spriteAnimationsIDs.push(ssid);
                        this.spriteAnimations[ssid] = spriteAnimation;
                        break;
                    case 'plane':
                        var nPartsU = this.reader.getFloat(descendantsNodeNames[k], 'npartsU');
                        var nPartsV = this.reader.getFloat(descendantsNodeNames[k], 'npartsV');

                        if (nPartsU == null || nPartsV == null  || isNaN(nPartsU) || isNaN(nPartsV))
                            return 'undefined plane';

                        temp = [descendantType, nPartsU, nPartsV];
                        break;
                    case 'patch':
                        var nPointsU = this.reader.getFloat(descendantsNodeNames[k], 'npointsU');
                        var nPointsV = this.reader.getFloat(descendantsNodeNames[k], 'npointsV');
                        var nPartsU = this.reader.getFloat(descendantsNodeNames[k], 'npartsU');
                        var nPartsV = this.reader.getFloat(descendantsNodeNames[k], 'npartsV');

                        if (nPointsU == null || nPointsV == null  || isNaN(nPointsU) || isNaN(nPointsV) || nPartsU == null || nPartsV == null  || isNaN(nPartsU) || isNaN(nPartsV))
                            return 'undefined patch';

                        var controlPoints = [];
                        for (var a = 0; a < descendantsNodeNames[k].children.length; a++) {
                            var xx = this.reader.getFloat(descendantsNodeNames[k].children[a],'x');
                            var yy = this.reader.getFloat(descendantsNodeNames[k].children[a],'y');
                            var zz = this.reader.getFloat(descendantsNodeNames[k].children[a],'z');   
                
                            controlPoints.push([xx,yy,zz,1]);
                        }

                        temp = [descendantType, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints];
                        break;
                    case 'defbarrel':
                        var base = this.reader.getFloat(descendantsNodeNames[k], 'base');
                        var middle = this.reader.getFloat(descendantsNodeNames[k], 'middle');
                        var height = this.reader.getFloat(descendantsNodeNames[k], 'height');
                        var slices = this.reader.getFloat(descendantsNodeNames[k], 'slices');
                        var stacks = this.reader.getFloat(descendantsNodeNames[k], 'stacks');
                        
                        temp = [descendantType, base, middle, height, slices, stacks];
                        break;
                    default:
                        break;
                }
                this.nodes[nodeID].addLeaf(new MyGraphLeaf(this, temp));
            }
        }

    }

  }   

    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;
        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color = [r, g, b, a];
        
        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        if (this.nodes[this.idRoot].material == null){
            var mat = new CGFappearance(this.scene);
            mat.setShininess(0.0);
            mat.setAmbient(1.0, 1.0, 1.0, 1.0);
            mat.setDiffuse(1.0, 1.0, 1.0, 1.0);
            mat.setSpecular(1.0, 1.0, 1.0, 1.0);
            mat.setEmission(1.0, 1.0, 1.0, 1.0);

            this.nodes[this.idRoot].material = mat;
        }

        //To do: Create display loop for transversing the scene graph, calling the root node's display function
        this.nodes[this.idRoot].display(this.nodes[this.idRoot].materialID, this.nodes[this.idRoot].textureId);
    }
}
