/**
 * MyGameBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.tiles = [ //MyTile(scene,col,row,board,piece)
            [new MyTile(this.scene, 3, 2, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 4, 2, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 5, 2, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 6, 2, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 7, 2, this, null,this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 8, 2, this, null, this.scene.graph.materials['DarkBrown'])],
            [new MyTile(this.scene, 3, 3, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 4, 3, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 5, 3, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 6, 3, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 7, 3, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 8, 3, this, null, this.scene.graph.materials['LightBrown'])],
            [new MyTile(this.scene, 3, 4, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 4, 4, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 5, 4, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 6, 4, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 7, 4, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 8, 4, this, null, this.scene.graph.materials['DarkBrown'])],
            [new MyTile(this.scene, 3, 5, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 4, 5, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 5, 5, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 6, 5, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 7, 5, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 8, 5, this, null, this.scene.graph.materials['LightBrown'])],
            [new MyTile(this.scene, 3, 6, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 4, 6, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 5, 6, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 6, 6, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 7, 6, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 8, 6, this, null, this.scene.graph.materials['DarkBrown'])],
            [new MyTile(this.scene, 3, 7, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 4, 7, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 5, 7, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 6, 7, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 7, 7, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 8, 7, this, null, this.scene.graph.materials['LightBrown'])]
        ];

        this.playerOnePieces = [new MyTile(this.scene, 2, 9, this, new MyPiece(scene, "plyr1"), null), new MyTile(this.scene, 3, 9, this, new MyPiece(scene, "plyr1"), null), new MyTile(this.scene, 4, 9, this, new MyPiece(scene, "plyr1"), null), new MyTile(this.scene, 5, 9, this, new MyPiece(scene, "plyr1"), null), new MyTile(this.scene, 6, 9, this, new MyPiece(scene, "plyr1"), null), new MyTile(this.scene, 7, 9, this, new MyPiece(scene, "plyr1"),null), new MyTile(this.scene, 8, 9, this, new MyPiece(scene, "plyr1"), null), new MyTile(this.scene, 9, 9, this, new MyPiece(scene, "plyr1"), null)];
        this.playerTwoPieces = [new MyTile(this.scene, 2, 0, this, new MyPiece(scene, "plyr2"), null), new MyTile(this.scene, 3, 0, this, new MyPiece(scene, "plyr2"), null), new MyTile(this.scene, 4, 0, this, new MyPiece(scene, "plyr2"), null), new MyTile(this.scene, 5, 0, this, new MyPiece(scene, "plyr2"), null), new MyTile(this.scene, 6, 0, this, new MyPiece(scene, "plyr2"), null), new MyTile(this.scene, 7, 0, this, new MyPiece(scene, "plyr2"),null), new MyTile(this.scene, 8, 0, this, new MyPiece(scene, "plyr2"), null), new MyTile(this.scene, 9, 0, this, new MyPiece(scene, "plyr2"), null)];

        this.replacerTile = new MyTile(this.scene, 1, 6, this, new MyPiece(scene, "plyr1"), null);
        this.replacerTile2 = new MyTile(this.scene, 1, 6, this, new MyPiece(scene, "plyr2"), null);

        this.currentPlayerOnePieces = 8;
        this.currentPlayerTwoPieces = 8;

        this.PlayerOneSpriteSheet = this.scene.graph.nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive;
        this.PlayerTwoSpriteSheet = this.scene.graph.nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive;

        this.blackPiece = new MyPiece(scene, "black");
        this.whitePiece = new MyPiece(scene, "white");
    }

    resetBoard() {
        this.tiles = [ //MyTile(scene,col,row,board,piece)
            [new MyTile(this.scene, 3, 2, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 4, 2, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 5, 2, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 6, 2, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 7, 2, this, null,this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 8, 2, this, null, this.scene.graph.materials['DarkBrown'])],
            [new MyTile(this.scene, 3, 3, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 4, 3, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 5, 3, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 6, 3, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 7, 3, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 8, 3, this, null, this.scene.graph.materials['LightBrown'])],
            [new MyTile(this.scene, 3, 4, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 4, 4, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 5, 4, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 6, 4, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 7, 4, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 8, 4, this, null, this.scene.graph.materials['DarkBrown'])],
            [new MyTile(this.scene, 3, 5, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 4, 5, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 5, 5, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 6, 5, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 7, 5, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 8, 5, this, null, this.scene.graph.materials['LightBrown'])],
            [new MyTile(this.scene, 3, 6, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 4, 6, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 5, 6, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 6, 6, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 7, 6, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 8, 6, this, null, this.scene.graph.materials['DarkBrown'])],
            [new MyTile(this.scene, 3, 7, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 4, 7, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 5, 7, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 6, 7, this, null, this.scene.graph.materials['LightBrown']), new MyTile(this.scene, 7, 7, this, null, this.scene.graph.materials['DarkBrown']), new MyTile(this.scene, 8, 7, this, null, this.scene.graph.materials['LightBrown'])]
        ];
    }

    setBoard(board){
        this.tiles = board;
    }

    getCurrentPlayerOnePieces(){
        var counter = 0;
        
        for (var x = 0; x < this.playerOnePieces.length; x++){
            if (this.playerOnePieces[x].piece != null)
                counter++
        }

        return counter;
    }

    getCurrentPlayerTwoPieces(){
        var counter = 0;
        
        for (var x = 0; x < this.playerTwoPieces.length; x++){
            if (this.playerTwoPieces[x].piece != null)
                counter++
        }

        return counter;
    }

    getPiece(x, y) {
        return this.tiles[y][x].getPiece();
    }

    addMove(playerTurn, move){
        this.addPiece(parseInt(move[0]) - 1, parseInt(move[1]) - 1, playerTurn);
    }

    getBoardForProlog() {
        let board = "[";
        for (var x = 0; x < 6; x++) {
            board += "["
            for (var y = 0; y < 6; y++){
                if (this.tiles[x][y].piece == null)
                    board += "empty";
                else {
                    switch(this.tiles[x][y].piece.type){
                        case "plyr1":
                            board += "plyr1";
                            break;
                        case "plyr2":
                            board += "plyr2";
                            break;
                        default:
                            break;
                    }
                }
                if (y < 5)
                    board += ",";
            }
            if (x < 5)
                board += "],";
        }
        board += "]]";
        return board;
    }

    removeFromPlayerPieces(playerTurn, coords){
        switch(playerTurn){
            case 1:
                this.playerOnePieces[coords].removePiece();
                break;
            case 2:
                this.playerTwoPieces[coords].removePiece();
                break;
            default:
                break;
        }
    }

    updateBoard(){
        for (var x = 0; x < 6; x++) {
            for (var y = 0; y < 6; y++){
                switch(this.nextStateBoard[y][x]){
                    case "empty":
                        this.tiles[y][x].piece = null;
                        break;
                    case "plyr1":
                        this.tiles[y][x].piece = new MyPiece(this.scene, "plyr1");
                        break;
                    case "plyr2":
                        this.tiles[y][x].piece = new MyPiece(this.scene, "plyr2");
                        break;
                    default:
                        break;
                }
            }
        }

        this.scene.gameOrchestrator.gameSequence.setBoard(this.getBoardForProlog());
        this.scene.gameOrchestrator.prolog.checkWin(this.getBoardForProlog());
        this.scene.gameOrchestrator.updatePlayerPieces();
    }

    setNextStateBoard(newBoard){
        let response = newBoard.slice(1, -1).split(",");
        var updatedBoard = [];
        var auxBoard = [];
        for (var x = 0; x < response.length; x++){
            if (response[x][0] == "["){
                auxBoard = [];
                auxBoard.push(response[x].substring(1))
            }
            else if (response[x].charAt(response[x].length - 1) == "]"){
                auxBoard.push(response[x].substring(0, response[x].length-1));
                updatedBoard.push(auxBoard);
            }
            else auxBoard.push(response[x]);
        }
        this.nextStateBoard = updatedBoard;
    }

    getPlayerOnePiecesOnBoard(){
        var counter = 0;
        for (var x = 0; x < 6; x++){
            for (var y = 0; y < 6; y++){
                if (this.tiles[x][y].piece != null){
                    if (this.tiles[x][y].piece.type == "plyr1")
                        counter++;
                }
            }
        }

        return counter;
    }

    getPlayerTwoPiecesOnBoard(){
        var counter = 0;
        for (var x = 0; x < 6; x++){
            for (var y = 0; y < 6; y++){
                if (this.tiles[x][y].piece != null){
                    if (this.tiles[x][y].piece.type == "plyr2")
                        counter++;
                }
            }
        }

        return counter;
    }

    display() {
        for (let x = 0; x < 6; x++)
            for (let y = 0; y < 6; y++)
                this.tiles[x][y].display();
        for (let x = 0; x < this.playerOnePieces.length; x++){
            this.playerOnePieces[x].display();
            this.playerTwoPieces[x].display();
        }

        //this.replacerTile.display();
        //this.replacerTile2.display();
    }
}