/* Script for Tic-Tac-Toe */
//We will use table implementation of tictactoe.
//-1 means empty cell, 0 represents circle and 1 represents cross
gameMatrix=[
    [[-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],]
]

//console.log(gameMatrix);

//We assume gameMatrix is always a square, which can be easily modified btw 
function renderGameMatrix(gameMatrix,parentNode){
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

            cell.appendChild(cellContent);

            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    parentNode.appendChild(table);
    
    /*Remeber that I have to insert table attributes below this, like border,etc. */
}
renderGameMatrix(gameMatrix,document.getElementById('game-matrix'));

//Function which takes the table node and returns rownode by index
function getRow(tableNode,index=0){
    tbody=tableNode.querySelector('tbody');
    
    return tbody.querySelectorAll('tr')[index];
}

function getCell(tableNode,index_i=0,index_j=0){
    return getRow(tableNode,index_i).querySelectorAll('td')[index_j];
}

gameTable=document.querySelector('#game-table');
console.log(getCell(gameTable,0,1));

function changeTile(i,j,stateValue) {
    //stateValue refers to stateValue of cell which is being changed. Refer to gameMatrix defn for state usage
    gameMatrix[i][j] = stateValue;
    tileCell= getCell(gameTable,i,j);

    if (stateValue===0) {
        tileCell.innerHTML='<img src="./assets/circle.png" alt="circle">';
    } else if (stateValue===1) {
        tileCell.innerHTML='<img src="./assets/cross.png" alt="cross">'
    }
}

