class MyGameMove extends CGFobject {
    constructor(scene, playerTurn, startTile, endTile, board, piece) {
        super(scene);
        this.playerTurn = playerTurn;
        this.startTile = startTile;
        this.endTile = endTile;
        this.board = board;
        this.piece = piece;
        this.playerTurn = 1;
    }

    setBoard(board){
        this.board = board;
    }

    setPlayerTurn(turn) {
        this.playerTurn = turn;
    }

    animate(){
        this.scene.gameOrchestrator.animator.animate(this);
    }
}