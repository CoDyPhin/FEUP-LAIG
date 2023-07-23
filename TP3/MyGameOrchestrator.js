class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.prolog = new MyPrologInterface(scene);
        this.gameStarted = false;
        this.analyzedBoard = false;
        this.playerTime = 10 + this.scene.selectedPlayerTime * 10;
    }
    
    changeTheme(theme) {
        this.scene.graph = this.scene.XMLScenes[theme];
        this.theme = this.scene.XMLScenes[theme];
    }

    createBoard(){
        this.gameBoard = new MyGameBoard(this.scene);
    }

    startGame(){
        if (this.totalAngle % 2*Math.PI != 0){
            if (this.playerTurn == 2)
                this.scene.XMLScenes[0].cameras[5].orbit([0, 1, 0], Math.PI);
        }

        this.theme = this.scene.graph;
        this.gameBoard = new MyGameBoard(this.scene);
        this.animator = new MyAnimator(this.scene, this);
        this.gameSequence = new MyGameSequence(this.scene);
        this.playerTurn = 1;
        this.currentMove = [null,null];
        this.moveBeingPlayed = false;
        this.gameEnded = false;
        this.fromTheBox = false;
        this.undoing = false;
        this.lastPiecesFromBox = [];
        this.needPiecesFromBox = false;
        this.botPlaying = false;
        this.rotateCamera = false;
        this.cameraAngle = 0;
        this.totalAngle = 0;
        this.moveStartTime = 0;
        this.gameStarted = true;
        this.cameFromUndo = false;
        this.playerTime = 10 + this.scene.selectedPlayerTime * 10;
        this.timeForThisGame = 10 + this.scene.selectedPlayerTime * 10;

        this.scene.XMLScenes[0].nodes["player1Confetti1"].leaves[0].primitive.displayAnim = false;
        this.scene.XMLScenes[0].nodes["player1Confetti2"].leaves[0].primitive.displayAnim = false;
        this.scene.XMLScenes[1].nodes["player1Confetti1"].leaves[0].primitive.displayAnim = false;
        this.scene.XMLScenes[1].nodes["player1Confetti2"].leaves[0].primitive.displayAnim = false;
        this.scene.XMLScenes[0].nodes["player2Confetti1"].leaves[0].primitive.displayAnim = false;
        this.scene.XMLScenes[0].nodes["player2Confetti2"].leaves[0].primitive.displayAnim = false;
        this.scene.XMLScenes[1].nodes["player2Confetti1"].leaves[0].primitive.displayAnim = false;
        this.scene.XMLScenes[1].nodes["player2Confetti2"].leaves[0].primitive.displayAnim = false;

        this.scene.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText("0");
        this.scene.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText("0");
        this.scene.XMLScenes[1].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText("0");
        this.scene.XMLScenes[1].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText("0");
    }

    orchestrate() { 
        if (!this.rotatingCameraLeft && !this.rotatingCameraRight){
            if (this.scene.selectedCamera == 5){
                if (!this.moveBeingPlayed){
                    if (this.scene.selectedGameMode == 0)
                        this.managePick(this.scene.pickResults);
                    else if (this.scene.selectedGameMode == 1){
                        switch(this.playerTurn){
                            case 1:
                                this.managePick(this.scene.pickResults);
                                break;
                            case 2:
                                this.getBotMove();
                                this.playerTurn = 1;
                                break;
                            default:
                                break;
                        }
                    }
                    else if (this.scene.selectedGameMode == 2){
                        switch(this.playerTurn){
                            case 1:
                                if (!this.botPlaying){
                                    this.getBotMove();
                                    this.playerTurn = 2;
                                }
                                break;
                            case 2:
                                if (!this.botPlaying){
                                    this.getBotMove();
                                    this.playerTurn = 1;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
    }

    getBotMove(){
        this.botPlaying = true;
        if (this.scene.intelligent)
            this.prolog.getBotMove(this.gameBoard.getBoardForProlog(), 2, this.playerTurn);
        else
            this.prolog.getBotMove(this.gameBoard.getBoardForProlog(), 1, this.playerTurn);
    }

    undo() {
        if (this.gameSequence.moves.length > 0 && !this.moveBeingPlayed){
            this.undoing = true;
            this.cameFromUndo = true;
            var lastMove = this.gameSequence.moves[this.gameSequence.moves.length - 1];
            this.moveBeingPlayed = true;

            this.movePiece(new MyGameMove(this.scene, lastMove.playerTurn, lastMove.endTile, lastMove.startTile, lastMove.board, lastMove.piece));
            this.gameSequence.undo();

            if (this.gameSequence.moves.length == 0){
                this.rotatingCameraLeft = true;
                this.gameBoard.resetBoard();
            }
            else {
                var secondLastMove = this.gameSequence.moves[this.gameSequence.moves.length - 1];

                switch(this.playerTurn){
                    case 1:
                        var whitePiecesEjected = (secondLastMove.board.split("plyr1").length - 1) - (lastMove.board.split("plyr1").length - 1);
                        var blackPiecesEjected = (secondLastMove.board.split("plyr2").length - 1 + 1) - (lastMove.board.split("plyr2").length - 1);
                        break;
                    case 2:
                        var whitePiecesEjected = (secondLastMove.board.split("plyr1").length - 1 + 1) - (lastMove.board.split("plyr1").length - 1);
                        var blackPiecesEjected = (secondLastMove.board.split("plyr2").length - 1) - (lastMove.board.split("plyr2").length - 1);
                        break;
                    default:
                        break;
                }
                
                for (let x = 0; x < blackPiecesEjected; x++){
                    this.gameBoard.playerTwoPieces[this.lastPiecesFromBox[this.lastPiecesFromBox.length - 1].col - 2].removePiece();
                    this.lastPiecesFromBox.pop();
                }

                for (let x = 0; x < whitePiecesEjected; x++) {
                    this.gameBoard.playerOnePieces[this.lastPiecesFromBox[this.lastPiecesFromBox.length - 1].col - 2].removePiece();
                    this.lastPiecesFromBox.pop();
                }
                
                this.gameBoard.setNextStateBoard(secondLastMove.board);
                this.gameBoard.updateBoard();

                this.scene.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText(this.gameBoard.getPlayerOnePiecesOnBoard().toString());
                this.scene.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText(this.gameBoard.getPlayerTwoPiecesOnBoard().toString());
                this.scene.XMLScenes[1].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText(this.gameBoard.getPlayerOnePiecesOnBoard().toString());
                this.scene.XMLScenes[1].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText(this.gameBoard.getPlayerTwoPiecesOnBoard().toString());
            }
        }
    }

    managePick() {
        if (!this.gameEnded){
            if (!this.moveBeingPlayed && !this.botPlaying){
                if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                    for (var i = 0; i < this.scene.pickResults.length; i++) {
                        var obj = this.scene.pickResults[i][0];
                        if (obj) {
                            var uniqueId = this.scene.pickResults[i][1];
                            this.OnObjectSelected(obj, uniqueId);
                        }
                    }
                    this.scene.pickResults.splice(0, this.scene.pickResults.length);
                }
            }
        }
    }

    OnObjectSelected(obj, uniqueId) {
        var customId = uniqueId.toString();
        var move = [customId[1] - 1, customId[0] - 2];

        if (obj instanceof MyPiece) {
            if (move[0] > 6 || move[0] < 0){
                switch(this.playerTurn){
                    case 1:
                        if (move[0] > 6)
                            this.currentMove[0] = move[1];
                        break;
                    case 2:
                        if (move[0] < 0)
                            this.currentMove[0] = move[1];
                        break;
                    default:
                        break;
                }
            }
        } 
        else if (obj instanceof MyTile) {
            if (this.currentMove[0] != null){
                if (this.gameBoard.tiles[move[0]-1][move[1]-1].piece == null){
                    this.currentMove[1] = move;
                    this.makeMove(this.currentMove);
                }
            }
        }
    }

    makeMove(currentMove){
        this.needPiecesFromBox = false;
        var move = currentMove[1];
        move.push(this.playerTurn.toString());
        
        switch(this.playerTurn){
            case 1:
                this.movePiece(new MyGameMove(this.scene, this.playerTurn, this.gameBoard.playerOnePieces[currentMove[0]], this.gameBoard.tiles[move[0]-1][move[1]-1], this.gameBoard.getBoardForProlog(), this.gameBoard.playerOnePieces[currentMove[0]].piece));
                this.scene.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.text) + 1).toString());
                this.scene.XMLScenes[1].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[1].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.text) + 1).toString());
                break;
            case 2:
                this.movePiece(new MyGameMove(this.scene, this.playerTurn, this.gameBoard.playerTwoPieces[currentMove[0]], this.gameBoard.tiles[move[0]-1][move[1]-1], this.gameBoard.getBoardForProlog(), this.gameBoard.playerTwoPieces[currentMove[0]].piece));
                this.scene.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.text) + 1).toString());
                this.scene.XMLScenes[1].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[1].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.text) + 1).toString());
                break;
            default:
                break;
        }

        this.analyzedBoard = false;
        this.prolog.makeMove(move, this.gameBoard.getBoardForProlog());
        this.gameBoard.removeFromPlayerPieces(this.playerTurn, currentMove[0]);
        this.playerTurn = 1 + (this.playerTurn % 2);
    }

    movePiece(move){
        this.moveBeingPlayed = true;  
        if (!this.fromTheBox && !this.undoing && !this.scene.moviePlaying){
            this.gameSequence.addMove(move);
            this.gameSequence.moves[this.gameSequence.moves.length - 1].setPlayerTurn(this.playerTurn);
        }
        this.scene.XMLScenes[0].nodes["player1Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
        this.scene.XMLScenes[0].nodes["player2Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
        this.scene.XMLScenes[1].nodes["player1Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
        this.scene.XMLScenes[1].nodes["player2Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
        this.animator.animate(move);
    }

    updatePlayerPieces(){
        var newPiecesForPlayerOne = 8 - this.gameBoard.getCurrentPlayerOnePieces() - this.gameBoard.getPlayerOnePiecesOnBoard();
        var newPiecesForPlayerTwo = 8 - this.gameBoard.getCurrentPlayerTwoPieces() - this.gameBoard.getPlayerTwoPiecesOnBoard();

        if (newPiecesForPlayerOne > 0 && !this.undoing){
            this.getFromBoxForOne();
        }
        else if (newPiecesForPlayerTwo > 0 && !this.undoing){
            this.getFromBoxForTwo();
        }
        else if (this.undoing) {
            this.rotatingCameraLeft = true;
        }

        if (!this.cameFromUndo)
            this.cameFromUndo = false;

        this.currentMove = [null, null];
    }

    getFromBoxForOne(){
        this.moveBeingPlayed = true;
        this.fromTheBox = true;
    
        for (var y = 0; y < this.gameBoard.playerOnePieces.length; y++){
            if (this.gameBoard.playerOnePieces[y].piece == null){
                this.movePiece(new MyGameMove(this.scene, this.playerTurn, this.gameBoard.replacerTile, this.gameBoard.playerOnePieces[y], this.scene.gameOrchestrator.gameBoard.getBoardForProlog(), new MyPiece(this.scene, "plyr1")));
                break;
            }
        }
    }

    getFromBoxForTwo(){
        this.moveBeingPlayed = true;
        this.fromTheBox = true;

        for (var y = 0; y < this.gameBoard.playerTwoPieces.length; y++){
            if (this.gameBoard.playerTwoPieces[y].piece == null){
                this.movePiece(new MyGameMove(this.scene, this.playerTurn, this.gameBoard.replacerTile2, this.gameBoard.playerTwoPieces[y], this.scene.gameOrchestrator.gameBoard.getBoardForProlog(), new MyPiece(this.scene, "plyr2")));
                break;
            }
        }
    }

    playMovie() {
        this.playerTurn = 1;
        this.gameBoard = new MyGameBoard(this.scene);
        this.gameSequence.currentMove = 0;
        this.gameSequence.animate();
    }

    update(t) {
        if (this.gameStarted){
            if (this.moveBeingPlayed){
                this.animator.update(t);
            }
            else {
                if (!this.rotatingCameraRight){
                    if (this.moveStartTime == 0){
                        this.moveStartTime = t;
                    }
                    this.playerTime = this.timeForThisGame - (t - this.moveStartTime) / 1000;
                    switch(this.playerTurn){
                        case 1:
                            if (this.playerTime < 9.5){
                                this.scene.XMLScenes[0].nodes["player1Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString() + " ");
                                this.scene.XMLScenes[1].nodes["player1Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString() + " ");
                            }
                            else {
                                this.scene.XMLScenes[0].nodes["player1Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString());
                                this.scene.XMLScenes[1].nodes["player1Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString());
                            }
                            break;
                        case 2:
                            if (this.playerTime < 9.5){
                                this.scene.XMLScenes[0].nodes["player2Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString() + " ");
                                this.scene.XMLScenes[1].nodes["player2Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString() + " ");
                            }
                            else {
                                this.scene.XMLScenes[0].nodes["player2Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString());
                                this.scene.XMLScenes[1].nodes["player2Time"].leaves[0].primitive.setText("Time:" + Math.round(this.playerTime).toString());
                            }
                            break;
                        default:
                            break;
                    }

                    if (this.playerTime <= 0){
                        this.analyzedBoard = true;
                        this.playerTurn = 1 + (this.playerTurn % 2);
                        this.scene.gameOrchestrator.playerTime = this.timeForThisGame;
                        this.scene.gameOrchestrator.moveStartTime = 0;
                        this.rotatingCameraRight = true;
                        this.updatePlayerPieces();
                    }
                }
            }
            if (this.scene.moviePlaying){
                this.gameSequence.animate();
            }
        }
        if (this.gameStarted)
            this.playerTime = this.timeForThisGame;
        else this.playerTime = 10 + 10 * this.scene.selectedPlayerTime;
        if (!this.gameStarted){
            this.scene.XMLScenes[0].nodes["player1Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
            this.scene.XMLScenes[0].nodes["player2Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
            this.scene.XMLScenes[1].nodes["player1Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
            this.scene.XMLScenes[1].nodes["player2Time"].leaves[0].primitive.setText("Time:" + this.playerTime);
        }
    }

    rotateCamRight(){
        if ((!this.gameEnded && this.analyzedBoard && !this.fromTheBox) || this.moviePlaying){
            this.scene.XMLScenes[0].cameras[5].orbit([0, 1, 0], Math.PI / 90.0);
            this.scene.XMLScenes[1].cameras[5].orbit([0, 1, 0], Math.PI / 90.0);
            this.cameraAngle += Math.PI / 90.0;
            this.totalAngle += Math.PI / 90.0;
            if (this.cameraAngle > Math.PI){
                this.rotatingCameraRight = false;
                this.cameraAngle = 0;
            }
        }
    }

    rotateCamLeft(){
        this.scene.XMLScenes[0].cameras[5].orbit([0, 1, 0], -Math.PI / 50.0);
        this.scene.XMLScenes[1].cameras[5].orbit([0, 1, 0], -Math.PI / 50.0);
        this.cameraAngle -= Math.PI / 50.0;
        this.totalAngle -= Math.PI / 50.0;
        if (this.cameraAngle < -Math.PI){
            this.rotatingCameraLeft = false;
            this.cameraAngle = 0;
        }
    }

    display() {
        if (this.rotatingCameraRight && !this.gameEnded)
            this.rotateCamRight();
        if (this.rotatingCameraLeft && this.undoing && !this.gameEnded)
            this.rotateCamLeft();
        this.gameBoard.display();
        if (this.moveBeingPlayed){
            this.animator.display();
        }
        if (this.theme != null)
            this.theme.displayScene();
    }
}   