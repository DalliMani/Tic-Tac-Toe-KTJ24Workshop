/* Script for Tic-Tac-Toe */

//Let's start with players
class Player{
    //We create a player who has the following properties
    //A id which is used to check if it's their turn or not
    //A name
    //Choice indicates their choice of whether they put cross or circle
    //-1 means empty cell, 0 represents circle and 1 represents cross (ideally a player's is always 0 or 1)
    constructor(id,name,choice){
        this.id=id
        this.name=name;
        this.choice=choice;
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

//Intiating both the players with random choice, note that the first player is always player 1
let Player1= new Player(0,"Player 1",randInt(0,2));
let Player2= new Player(1,"Player 2",Player1.choice ? 0:1);

let Player1_Score=0,Player2_Score=0;

//We will use the currentPlayer to keep track of whose turn it is now and whose next
//Implementation of player 1 coming first
let currentPlayer=Player1;

//Before we move onto the table it would be helpful to keep a removeAllEventListeners function
function replaceWithClone(NodeElement){
    NodeElement.replaceWith(NodeElement.cloneNode(true));
}
const removeAllEventListeners=replaceWithClone;

//We will use table implementation of tictactoe. (Interesting Note is that until game-table generation it's all independednt of currentPlayer)
//-1 means empty cell, 0 represents circle and 1 represents cross
let gameMatrix; //This is the global matrix which contains the data of the matrix in number format
//Creates an empty genEmptyGameMatrix
function genEmptyGameMatrix(N){
    let gameMatrix=[];
    let row=[];
    for (let i=0;i<N;++i) {row.push(-1);}
    for (let i=0;i<N;++i) {gameMatrix.push(row);}
    return gameMatrix;
}

gameMatrix=genEmptyGameMatrix(3);


//In this function, we assume gameMatrix is always a square, which can be easily modified btw
//Also, this renders empty matrix as you can see, because each individual modification can be carried by a function
function renderEmptyGameMatrix(gameMatrix,parentNode){
    //create table and table body

    const table=document.createElement("table");
    table.id='game-table';
    const tableBody=document.createElement("tbody");

    //keeping rowno and colno for more readability
    const rowno=gameMatrix.length;
    const colno=gameMatrix[0].length;

    for (let i=0;i<rowno;++i){
        //Create row
        const row=document.createElement("tr");
        
        for (let j=0;j<colno;++j){
            const cell= document.createElement("td");

            const cellContent=document.createElement('img');
            cellContent.src='./assets/blank.png';
            cellContent.alt='A';

            cellContent.addEventListener('click',makeTurnWrapper(i,j));
            
            cell.appendChild(cellContent);

            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    parentNode.appendChild(table);
    
    /*Remeber that I have to insert table attributes below this, like border,etc. */
}

//Functions to access the items in table
//Function which takes the table node and returns rownode by index
function getRow(tableNode,index=0){
    const tbody=tableNode.querySelector('tbody');
    return tbody.querySelectorAll('tr')[index];
}

//Function which takes tableNode and index of cell and returns the cell node
function getCell(tableNode,index_i=0,index_j=0){
    return getRow(tableNode,index_i).querySelectorAll('td')[index_j];
}

function getGameTable(){
    return document.querySelector('#game-table');
}
//Rendering done using functions
renderEmptyGameMatrix(gameMatrix,document.getElementById('game-matrix'));
let gameTable=getGameTable();


//The above part is for generation of game-matrix etc.
//Now let's add player mechanics
function getCurrentTurn(){
    return currentPlayer.choice;
}

function changeTileHelper(i,j,newTileValue,gameTable) {
    //newTileValue refers to newTileValue of cell which is being changed. Refer to gameMatrix defn for state usage
    gameMatrix[i][j] = newTileValue;
    let tileCell= getCell(gameTable,i,j);

    if (newTileValue===0) {
        tileCell.innerHTML='<img src="./assets/circle.png" alt="circle">';
    } else if (newTileValue===1) {
        tileCell.innerHTML='<img src="./assets/cross.png" alt="cross">'
    }
}

function changeTile(i,j){
    changeTileHelper(i,j,getCurrentTurn(),gameTable);
}

//This changes the indicator to cross if choice given is 1 and circle if choice given is 0.
function changeIndicatorHelper(choice){
    if (choice==0){//If you want to change circle..
        document.querySelector('#circle-indicator').className='active-indicator';
        document.querySelector('#cross-indicator').className=null;
    }
    if (choice==1){//Vice-versa
        document.querySelector('#cross-indicator').className='active-indicator';
        document.querySelector('#circle-indicator').className=null;
    }
}

function initIndicator(){//Inititates the indicator
    changeIndicatorHelper(getCurrentTurn());
}

function changeIndicator(){//This toggles the indicator
    const nextTurn=getCurrentTurn() ? 0:1;
    changeIndicatorHelper(nextTurn);
}

function changeCurrentPlayer(){
    const currentTurn=getCurrentTurn();
    //If the ongoing turn is player1's, in which case current turn (cross or circle) is equal to player1's choice (cross or circle) hence currentPlayer becomres Player2;
    if (currentTurn==Player1.choice) currentPlayer=Player2;
    else currentPlayer=Player1;
}

function resetMatch(){
    //Resetting global variable gameMatrix
    gameMatrix=genEmptyGameMatrix(3);
    const gameMatrixDiv=document.getElementById('game-matrix');
    gameMatrixDiv.innerHTML='';//Making the game matrix empty again
    renderEmptyGameMatrix(gameMatrix,gameMatrixDiv);
    //changeTile relies on global variable gameTable which got nullified due to previous emptying of gameMatrixDiv
    gameTable=getGameTable();
}

initIndicator();

//Now let's apply styles onto the table
//Basically I will be adding classes to the cells now, like in-topmost, in-rightmost, in-leftmost, and in-bottommost
//Also, our assumption of a square is still hardcoded despite there being no necessity of a square.
function styleTable(tableNode,N_size_gamematrix){
    let topCell,bottomCell,leftCell,rightCell;
    for (let j=0;j<N_size_gamematrix;++j){
        topCell=getCell(tableNode,0,j);
        topCell.classList.add('in-topmost');
        bottomCell=getCell(tableNode,N_size_gamematrix-1,j);
        bottomCell.classList.add('in-bottommost');
    }
    for (let i=0;i<N_size_gamematrix;++i){
        leftCell=getCell(tableNode,i,0);
        leftCell.classList.add('in-leftmost');
        rightCell=getCell(tableNode,i,N_size_gamematrix-1);
        rightCell.classList.add('in-rightmost');
    }
}
styleTable(gameTable,3);


//To check the winning condititons, we need to check if there's a row or column or diagonal with the same value.
//For that let's write is___All functions which return is an entire row, column or diagonal has the value given, provided the index of row, column, or diagonal. Diagonal index will be explained near getNumberOfElementsInDiagonal.
//There's another possibility of implementation where we check if entire row has the same value or not if the row is uniform, then we declare the player with the choice same as that row's elements as the winner. But I think writing this way would be convenient, deespite it's inefficiency.
function isRowAll(value,row_index,Matrix){

    const row_size=Matrix[0].length;
    for (let j=0;j<row_size;++j){
        if (Matrix[row_index][j]!=value) return false;
    }
    return true;
}
function isColAll(value,col_index,Matrix){

    const col_size=Matrix.length;
    for (let i=0;i<col_size;++i){
        if (Matrix[col_index][i]!=value) return false;
    }
    return true;
}

//Let's discuss what the diagonal index is.
//Every square matrix has 2*(2N+1) diagonals and each diagonal can be characterized using one of it's end-elements
//Also, in that 2*(2N+1) diagonals, 2N+1 are left, like, '\'. And 2N+1 are right, like '/'.
//Standard keys for right diagonals are M[0][0],M[1][0]...,M[col_size-1][0]  (basically 0th col), M[col_size-1][1],M[col_size-1][2]...M[col_size-1][row_size-1] (basically the last row) and for these standard keys for right, we move up the diagonal
//Standard keys for left diagonals are M[0][0],M[1][0]...,M[col_size-1][0] (basically 0th col), M[0][1],M[0][2]...M[0][row_size-1] (basically the 0th row)... and for these standard keys for left, we move down the diagonal
function isValidIndex(i,j,Matrix){
    return (i>=0)&&(i<Matrix[0].length)&&(j>=0)&&(j<Matrix.length);
}

function isRightDiagonalAll(value,key_index_i,key_index_j,Matrix){
    let i=key_index_i,j=key_index_j;
    
    while (isValidIndex(i,j,Matrix)){
        if (Matrix[i][j]!=value) return false;
        //We move "UP" the "RIGHT" diagonal
        i-=1;
        j+=1;
    }
    return true;
}
function isLeftDiagonalAll(value,key_index_i,key_index_j,Matrix){
    let i=key_index_i,j=key_index_j;
    
    while (isValidIndex(i,j,Matrix)){
        if (Matrix[i][j]!=value) return false;
        //We move "DOWN" the "LEFT" diagonal
        i+=1;
        j+=1;
    }
    return true;
}

function isWinner(player,gameMatrix){
    playerChoice=player.choice;
    let row_size=gameMatrix[0].length, col_size=gameMatrix.length;
    
    //Checking rows
    for (let i=0;i<col_size;++i){
        if (isRowAll(playerChoice,i,gameMatrix)) return true;
    }
    
    //Checking cols
    for (let j=0;j<row_size;++j){
        if (isColAll(playerChoice,j,gameMatrix)) return true;
    }

    //checking all the right diagonals and left diagonals with keys on first column
    for (let i=0;i<col_size;++i){
        if (isLeftDiagonalAll(playerChoice,i,0,gameMatrix)) return true;
        if (isRightDiagonalAll(playerChoice,i,0,gameMatrix)) return true;
    }

    //Checking all keys of right and left diagonals in a row.
    for (let j=1;j<row_size;++j){
        if (isLeftDiagonalAll(playerChoice,0,j,gameMatrix)) return true;
        if (isRightDiagonalAll(playerChoice,col_size-1,j,gameMatrix)) return true;
    }

    return false;
}

//A match is considered over if all elements of gameMatrix are 0 or 1. i.e. if all elements are "non -1".
function isMatchOver(gameMatrix){
    //Following is a bool of whether every element is "non -1" or not, basically, checking if -1 is not-there(true) or thre (false).
    return gameMatrix.every(row => row.every( elem => (elem!=-1)));
}

function getWinStatus(){
    //winStatus of 0 indicates player 1 has won, 1 indicates player 2 has won, 2 indicates a draw, -1 indicates neither has won
    if (isWinner(Player1,gameMatrix)) return 0;
    if (isWinner(Player2,gameMatrix)) return 1;
    if (isMatchOver(gameMatrix)) return 2;
    return -1;
}

function makeTurnWrapper(i,j){
    //Returns the function to be executed when a cell is clicked

    const makeTurn= ()=>{
        changeTile(i,j);
        /*
        const winStatus=getWinStatus();
        console.log(`Winstatus: ${winStatus}`)
        if (winStatus==0){
            Player1_Score++;
            removeAllEventListeners(document.querySelector('#game-table'));//Make the board irresponsive
            setTimeout(resetMatch,5000);//Reset match in 5 seconds
        }
        if (winStatus==1){
            Player2_Score++;
            removeAllEventListeners
        }
        */
        changeIndicator();
        changeCurrentPlayer();
    }

    return makeTurn;
}