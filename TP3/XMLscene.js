/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.XMLScenes = [new MySceneGraph("LAIG_TP2_XML_T4_G05_1.xml", this), new MySceneGraph("LAIG_TP2_XML_T4_G05_2.xml", this)];
        this.loadedScenes = 0;
        this.graph = this.XMLScenes[0];
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(10);

        this.displayAxis = true;

        this.displayCameras = true;
        this.selectedCamera = 0;

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        this.setPickEnabled(true);

        this.playerTime = {
            '10 seconds': 0,
            '20 seconds': 1,
            '30 seconds': 2
        }
        this.selectedPlayerTime = 0;

        this.gameOrchestrator = new MyGameOrchestrator(this);
    
        this.gameModes = {
            'Player vs Player': 0,
            'Player vs Pc': 1,
            'Pc vs Pc': 2
        }
        this.selectedGameMode = 0;

        this.intelligent = false;

        this.undo = function() {
            if (this.gameOrchestrator.gameSequence != null && !this.gameOrchestrator.botPlaying && !this.gameOrchestrator.rotatingCameraLeft && !this.gameOrchestrator.rotatingCameraRight){
                if (this.gameOrchestrator.gameSequence.moves.length != 0){
                    this.gameOrchestrator.undo();
                }
            }
        }

        this.restart = function() {
            this.camera = this.graph.cameras[5];
            this.selectedCamera = 5;
            this.gameOrchestrator.startGame();
        }

        this.movie = function() {
            if (this.gameOrchestrator.gameSequence != null){
                if (this.gameOrchestrator.gameSequence.moves.length != 0){
                    this.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText("0");
                    this.XMLScenes[1].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText("0");
                    this.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText("0");
                    this.XMLScenes[1].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText("0");
                    if (this.gameOrchestrator.playerTurn == 2)
                        this.XMLScenes[0].cameras[5].orbit([0, 1, 0], Math.PI);
                    this.moviePlaying = true;
                    if (this.gameOrchestrator.gameSequence.moves.length > 0){
                        this.gameOrchestrator.animating = true;
                        this.gameOrchestrator.playMovie();
                    }
                }
            }
        }
    }   
    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        // Camera perto do centro
        //this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
        
        //Camera da cena inteira
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(90, 60, 90), vec3.fromValues(15, 0, 10));
        
        //this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(45, 45, 45), vec3.fromValues(20, 0, 0));
        
        //this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 90, 90), vec3.fromValues(50, 0, 10));
    }

    updateCamera(){
        this.camera = this.graph.cameras[this.selectedCamera];
        //this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);

                if (i < 3)
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded(){
        this.loadedScenes++;
        if (this.loadedScenes == 2)
            this.loadGraphs();
    }

    loadGraphs() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();
        
        this.camera = this.graph.cameras[0];
        //this.interface.setActiveCamera(this.graph.cameras[0]);
        this.interface.gui.add(this, 'selectedCamera', this.graph.camerasID).name('Selected Camera').onChange(this.updateCamera.bind(this));

        var lightsFolder = this.interface.gui.addFolder('Lights');
        
        for(var i = 0; i < this.graph.lights.length; i++) {
            lightsFolder.add(this.lights[i], 'enabled').name("Light: " + i);
        }

        lightsFolder.open();

        this.sceneInited = true;

        this.gameOrchestrator.createBoard();
        this.gameOrchestrator.theme = this.graph;
    }

    update(t) {
        if (this.sceneInited && (this.gameOrchestrator.gameStarted || this.gameOrchestrator.gameStarted != null)) {
            this.gameOrchestrator.orchestrate();
            this.gameOrchestrator.update(t);
            for(var x=0; x<this.graph.spriteAnimationsIDs.length; x++){
                this.graph.spriteAnimations[this.graph.spriteAnimationsIDs[x]].update(t);
            }
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
		this.clearPickRegistration();
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        this.axis.display();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].update();
        }

        if (this.sceneInited) {
            if (this.gameOrchestrator.gameStarted || this.gameOrchestrator.gameStarted != null)
                this.gameOrchestrator.orchestrate();
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            //this.graph.displayScene();
            this.gameOrchestrator.display();
            //this.graph.displayScene();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}
