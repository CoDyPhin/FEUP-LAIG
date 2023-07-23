/**
 * MyPrologInterface
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPrologInterface extends CGFobject {
    constructor(scene) {
        super(scene);
    }

    checkWin(board) {
        this.makeRequest("game_over(" + board + ")", data => this.parseCheckWinReply(data));
    }

    getBotMove(board, level, playerTurn){
        this.makeRequest("choose_move(" + board + "," + playerTurn + "," + level + ")", data => this.parseBotReply(data));
    }

    makeMove(move, board){
        this.makeRequest("move(" + board + ",[" + move + "])", data => this.parseUpdatedBoard(data));
    }

    getPrologRequest(requestString, parseFunction, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.addEventListener("load", parseFunction);
        console.log('http://localhost:' + requestPort + '/' + requestString);
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(requestString, parseFunction) {				
        // Make Request
        this.getPrologRequest(requestString, parseFunction);
    }

    parseUpdatedBoard(data) {
        if (this.status === 400) {
            console.log("ERROR");
            return;
        }
        
        this.scene.gameOrchestrator.gameBoard.setNextStateBoard(data.target.response);
    }

    parseBotReply(data) {
        if (this.status === 400) {
            console.log("ERROR");
            return;
        }

        let response = data.target.responseText.slice(1, -1).split(",");

        var move = [];
        switch(parseInt(response[2])){
            case 1:
                for (let x = 0; x < this.scene.gameOrchestrator.gameBoard.playerOnePieces.length; x++){
                    if (this.scene.gameOrchestrator.gameBoard.playerOnePieces[x].piece != null){
                        move.push(x);
                        break;
                    }
                }
                break;
            case 2:
                for (let x = 0; x < this.scene.gameOrchestrator.gameBoard.playerTwoPieces.length; x++){
                    if (this.scene.gameOrchestrator.gameBoard.playerTwoPieces[x].piece != null){
                        move.push(x.toString());
                        break;
                    }
                }
                break;
            default:
                break;
        }
        var moveAux = [response[0], response[1]];
        if (this.scene.gameOrchestrator.gameBoard.tiles[parseInt(moveAux[0]) - 1][parseInt(moveAux[1]) - 1].piece == null){
            move.push(moveAux);
            this.scene.gameOrchestrator.playerTurn = 1 + (this.scene.gameOrchestrator.playerTurn % 2);
            this.scene.gameOrchestrator.makeMove(move);
            this.scene.gameOrchestrator.botPlaying = false;
        }
        else {
            this.scene.gameOrchestrator.playerTurn = 1 + (this.scene.gameOrchestrator.playerTurn % 2);
            if (this.scene.intelligent)
                this.scene.gameOrchestrator.prolog.getBotMove(this.scene.gameOrchestrator.gameBoard.getBoardForProlog(), 2, this.scene.gameOrchestrator.playerTurn);
            else
                this.scene.gameOrchestrator.prolog.getBotMove(this.scene.gameOrchestrator.gameBoard.getBoardForProlog(), 1, this.scene.gameOrchestrator.playerTurn);
        }
    }


    parseCheckWinReply(data) {
        if (this.status === 400) {
            console.log("ERROR");
            return;
        }
        if (data.target.response != 0){
            console.log("The Winner is Player " + data.target.response);
            switch(parseInt(data.target.response)){
                case 1:
                    this.scene.gameOrchestrator.gameEnded = true;
                    this.scene.XMLScenes[0].nodes["player1Confetti1"].leaves[0].primitive.displayAnim = true;
                    this.scene.XMLScenes[0].nodes["player1Confetti2"].leaves[0].primitive.displayAnim = true;
                    this.scene.XMLScenes[1].nodes["player1Confetti1"].leaves[0].primitive.displayAnim = true;
                    this.scene.XMLScenes[1].nodes["player1Confetti2"].leaves[0].primitive.displayAnim = true;
                    console.log(this.scene.XMLScenes[1].nodes["player1Confetti1"].leaves[0].primitive)
                    break;
                case 2:
                    this.scene.gameOrchestrator.gameEnded = true;
                    this.scene.XMLScenes[0].nodes["player2Confetti1"].leaves[0].primitive.displayAnim = true;
                    this.scene.XMLScenes[0].nodes["player2Confetti2"].leaves[0].primitive.displayAnim = true;
                    this.scene.XMLScenes[1].nodes["player2Confetti1"].leaves[0].primitive.displayAnim = true;
                    this.scene.XMLScenes[1].nodes["player2Confetti2"].leaves[0].primitive.displayAnim = true;
                    break;
                default:
                    break;
            }
        }
        else {
            if (!this.scene.gameOrchestrator.rotatingCameraLeft && !this.scene.gameOrchestrator.cameFromUndo)
                this.scene.gameOrchestrator.rotatingCameraRight = true;
        }
        
        if (this.scene.XMLScenes[0].nodes["scoreBoardPlayer1PiecesCounter"].leaves[0].primitive.text == "8") {
            this.scene.gameOrchestrator.gameEnded = true;
            console.log("The Winner is Player 1");
            this.scene.XMLScenes[0].nodes["player1Confetti1"].leaves[0].primitive.displayAnim = true;
            this.scene.XMLScenes[0].nodes["player1Confetti2"].leaves[0].primitive.displayAnim = true;
            this.scene.XMLScenes[1].nodes["player1Confetti1"].leaves[0].primitive.displayAnim = true;
            this.scene.XMLScenes[1].nodes["player1Confetti2"].leaves[0].primitive.displayAnim = true;
        }

        if (this.scene.XMLScenes[0].nodes["scoreBoardPlayer2PiecesCounter"].leaves[0].primitive.text == "8") {
            this.scene.gameOrchestrator.gameEnded = true;
            console.log("The Winner is Player 2");
            this.scene.XMLScenes[0].nodes["player2Confetti1"].leaves[0].primitive.displayAnim = true;
            this.scene.XMLScenes[0].nodes["player2Confetti2"].leaves[0].primitive.displayAnim = true;
            this.scene.XMLScenes[1].nodes["player2Confetti1"].leaves[0].primitive.displayAnim = true;
            this.scene.XMLScenes[1].nodes["player2Confetti2"].leaves[0].primitive.displayAnim = true;
        }

        this.scene.gameOrchestrator.analyzedBoard = true;
    }
}