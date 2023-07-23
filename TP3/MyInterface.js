/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.gameScene = 0;
        this.gameScenes = {
            'Home': 0,
            'Bar': 1,
        }

        // add a group of controls (and open/expand by defult)
      
        this.initKeys();

        this.initGameSettings();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    initGameSettings() {
        const folder = this.gui.addFolder("Game Options");
        folder.open();
        folder.add(this, 'gameScene', this.gameScenes).name('Game Scene').onChange(this.scene.gameOrchestrator.changeTheme.bind(this.scene.gameOrchestrator));
        folder.add(this.scene, 'selectedGameMode', this.scene.gameModes).name('Game Mode');
        folder.add(this.scene, 'selectedPlayerTime', this.scene.playerTime).name('Player Time');
        folder.add(this.scene, 'intelligent').name('Intelligent AI');
        folder.add(this.scene, 'restart').name('Start Game');
        folder.add(this.scene, 'undo').name('Undo');
        folder.add(this.scene, 'movie').name('Play Movie');
    }
}