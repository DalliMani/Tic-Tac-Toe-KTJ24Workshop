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

//We will use the currentPlayer to keep track of whose turn it is now and whose next
//Implementation of player 1 coming first
let currentPlayer=Player1;

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

            cellContent.addEventListener('click',()=>{
                changeTile(i,j);
                changeIndicator();
                changeCurrentPlayer();
            })
            
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

renderEmptyGameMatrix(gameMatrix,document.getElementById('game-matrix'));
gameTable=document.querySelector('#game-table');

//The above part is for generation of game-matrix etc.
//Now let's add player mechanics
function getCurrentTurn(){
    return currentPlayer.choice;
}

function changeTileHelper(i,j,newTileValue) {
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
    changeTileHelper(i,j,getCurrentTurn());
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

function resetGame(){
    gameMatrix=genEmptyGameMatrix(3);
    const gameMatrixElement=document.getElementById('game-matrix');
    gameMatrixElement.innerHTML='';//Making the game matrix empty again
    renderEmptyGameMatrix(gameMatrix,gameMatrix);
}