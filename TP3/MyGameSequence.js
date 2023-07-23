/**
 * MyGameSequence
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameSequence extends CGFobject {
    constructor(scene) {
        super(scene);
        this.moves = [];
        this.boards = [];
        this.turn = 1;
    }

    addMove(move) {
        const mov = move;
        this.moves.push(mov);
    }

    setBoard(board){
        this.moves[this.moves.length - 1].setBoard(board);
    }

    setPlayer(turn) {
        this.turn = turn;
    }

    undo() {
        this.moves.pop();
    }

    animate() {
        if (!this.scene.gameOrchestrator.moveBeingPlayed && !this.scene.gameOrchestrator.rotatingCameraRight) {
            if (this.currentMove < this.moves.length){
                if (this.moves[this.currentMove].playerTurn != this.turn){
                    this.scene.gameOrchestrator.rotatingCameraRight = true;
                    this.turn = 1 + (this.turn % 2);
                    this.scene.gameOrchestrator.playerTurn = 1 + (this.scene.gameOrchestrator.playerTurn % 2);
                }
                else {
                    var move = [this.moves[this.currentMove].startTile.col-2, [this.moves[this.currentMove].endTile.row-1, this.moves[this.currentMove].endTile.col-2]];
                    if (move != null && this.moves[this.currentMove].playerTurn == this.turn){
                        this.turn = 1 + (this.turn % 2);
                        this.scene.gameOrchestrator.makeMove(move);
                    }
                }
            }
            else{
                this.scene.currentMove = 0;
                this.scene.moviePlaying = false;
            }
        }
    }
}