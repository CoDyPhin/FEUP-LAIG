  
/**
 * MyAnimator
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyAnimator extends CGFobject {
    constructor(scene, orchestrator) {
        super(scene);
        this.orchestrator = orchestrator;
        this.animating = false;
    }

    animate(move) {
        this.animating = true;
        this.startTime = 0;
        this.startTile = move.startTile;
        this.endTile = move.endTile;
        this.piece = move.piece;
        let matrix = mat4.create();

        var middlePointCol = (this.startTile.col + this.endTile.col) / 2;
        var middlePointRow = (this.startTile.row + this.endTile.row) / 2;

        var middlePointCol1 = (this.startTile.col + middlePointCol) / 2;
        var middlePointRow1 = (this.startTile.row + middlePointRow) / 2;

        var middlePointCol2 = (middlePointCol + this.endTile.col) / 2;
        var middlePointRow2 = (middlePointRow + this.endTile.row) / 2;

        mat4.translate(matrix, matrix, [this.startTile.col, 0, this.startTile.row - 5]);
        
        if (this.startTile.col > 1){
            this.animation = new KeyFrameAnimation(this.scene, null, [new KeyFrame(0, [this.startTile.col,0,this.startTile.row - 5], [0,0,0], [1,1,1]), new KeyFrame(0.667, [middlePointCol1,2,middlePointRow1 - 5], [0,0,0], [1,1,1]), new KeyFrame(1.337, [middlePointCol2,2,middlePointRow2 - 5], [0,0,0], [1,1,1]), new KeyFrame(2, [this.endTile.col,0,this.endTile.row - 5], [0,0,0], [1,1,1])], matrix);
        }
        else
            this.animation = new KeyFrameAnimation(this.scene, null, [new KeyFrame(0, [this.startTile.col,0,this.startTile.row - 5], [0,0,0], [1,1,1]), new KeyFrame(0.5, [this.startTile.col,3,this.startTile.row - 5], [0,0,0], [1,1,1]), new KeyFrame(1, [this.endTile.col,0,this.endTile.row - 5], [0,0,0], [1,1,1])], matrix);
      
    }

    update(time) {
        if (this.startTime == 0){
            this.startTime = time;
        }
        else if ((time - this.startTime > 2000 && this.startTile.col > 1) || (time-this.startTime > 1000 && this.startTile.col == 1)) {
            this.scene.gameOrchestrator.moveBeingPlayed = false;
            this.scene.gameOrchestrator.playerTime = this.scene.gameOrchestrator.timeForThisGame;
            this.scene.gameOrchestrator.moveStartTime = 0;
            if (this.startTile.col > 1 && !this.scene.undoing && this.scene.gameOrchestrator.gameSequence.moves.length > 0){
                this.orchestrator.gameBoard.updateBoard(this.orchestrator.playerTurn);
                if (this.scene.moviePlaying){
                    this.scene.gameOrchestrator.gameSequence.currentMove++;
                }
            }
            else {
                this.scene.gameOrchestrator.fromTheBox = false;
                var playerOnePiecesToReplace = 8 - this.scene.gameOrchestrator.gameBoard.getCurrentPlayerOnePieces() - this.scene.gameOrchestrator.gameBoard.getPlayerOnePiecesOnBoard();
                var playerTwoPiecesToReplace = 8 - this.scene.gameOrchestrator.gameBoard.getCurrentPlayerTwoPieces() - this.scene.gameOrchestrator.gameBoard.getPlayerTwoPiecesOnBoard();

                switch(this.startTile.piece.type){
                    case "plyr1":
                        playerOnePiecesToReplace--;
                        break;
                    case "plyr2":
                        playerTwoPiecesToReplace--;
                        break;
                    default:
                        break;
                }

                if (this.startTile.piece.type == "plyr1"){
                    for (var x = 0; x < this.scene.gameOrchestrator.gameBoard.playerOnePieces.length; x++){
                        if (this.scene.gameOrchestrator.gameBoard.playerOnePieces[x].piece == null){
                            this.scene.gameOrchestrator.lastPiecesFromBox.push(this.endTile);
                            this.scene.gameOrchestrator.gameBoard.playerOnePieces[x].addPiece("plyr1");
                            this.scene.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.text) - 1).toString());
                            this.scene.XMLScenes[1].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[1].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.text) - 1).toString());
                            //this.scene.gameOrchestrator.gameBoard.PlayerOneSpriteSheet.setText((parseInt(this.scene.gameOrchestrator.gameBoard.PlayerOneSpriteSheet.text) - 1).toString());
                            playerOnePiecesToReplace--;
                            break;
                        }
                    }

                    playerOnePiecesToReplace = 8 - this.scene.gameOrchestrator.gameBoard.getCurrentPlayerOnePieces() - this.scene.gameOrchestrator.gameBoard.getPlayerOnePiecesOnBoard();
                    this.scene.gameOrchestrator.updatePlayerPieces();
                }
                else if (this.startTile.piece.type == "plyr2"){
                    for (var x = 0; x < this.scene.gameOrchestrator.gameBoard.playerTwoPieces.length; x++){
                        if (this.scene.gameOrchestrator.gameBoard.playerTwoPieces[x].piece == null){
                            this.scene.gameOrchestrator.lastPiecesFromBox.push(this.endTile);
                            this.scene.gameOrchestrator.gameBoard.playerTwoPieces[x].addPiece("plyr2");
                            this.scene.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.text) - 1).toString());
                            this.scene.XMLScenes[1].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.setText((parseInt(this.scene.XMLScenes[1].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.text) - 1).toString());
                            //this.scene.gameOrchestrator.gameBoard.PlayerTwoSpriteSheet.setText((parseInt(this.scene.gameOrchestrator.gameBoard.PlayerTwoSpriteSheet.text) - 1).toString());
                            playerTwoPiecesToReplace--;
                            break;
                        }
                    }

                    playerTwoPiecesToReplace = 8 - this.scene.gameOrchestrator.gameBoard.getCurrentPlayerTwoPieces() - this.scene.gameOrchestrator.gameBoard.getPlayerTwoPiecesOnBoard();

                    this.scene.gameOrchestrator.updatePlayerPieces();
                }
            }

            if (this.scene.gameOrchestrator.undoing){
                this.endTile.setPiece(this.piece);
                this.piece.setTile(this.endTile);
                this.scene.gameOrchestrator.playerTurn = 1 + (this.scene.gameOrchestrator.playerTurn % 2);
                this.scene.gameOrchestrator.undoing = false;
                this.scene.gameOrchestrator.rotatingCameraLeft = false;
            }
            else this.scene.gameOrchestrator.rotatingCameraRight = true;
        }

        if (time - this.startTime < 2000)
            this.animation.update(time - this.startTime);
    }

    display() {
        this.scene.pushMatrix();
        this.animation.apply(); 
        this.piece.display();
        this.scene.popMatrix();
    }
}