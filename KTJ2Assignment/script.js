/* Script for Tic-Tac-Toe */
//We will use table implementation of tictactoe.
//-1 means empty cell, 0 represents circle and 1 represents cross
gameMatrix=[
    [-1,-1,-1],
    [-1,-1,-1],
    [-1,-1,-1],
]

console.log(gameMatrix);

//We assume gameMatrix is always a square, which can be easily modified btw 
function generateMatrix(gameMatrix,parentNode){
    //create table and table body
    const table=document.createElement("table");
    const tableBody=document.createElement("tbody");
    //keeping rowno and colno for more readability
    const rowno=gameMatrix.length;
    const colno=gameMatrix[0].length;

    for (let i=0;i<rowno;++i){
        //Create row
        const row=document.createElement("tr");
        
        for (let j=0;j<colno;++j){
            const cell= document.createElement("td");

            const cellContent=document.createTextNode('A');
            cell.appendChild(cellContent);

            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    parentNode.appendChild(table);
    
    /*Remeber that I have to insert table attributes below this, like border,etc. */
}

function changeTile(i,j,stateValue) {
    //stateValue refers to stateValue of cell which is being changed. Refer to gameMatrix defn for state usage
    gameMatrix[i][j] = stateValue;

}

generateMatrix(gameMatrix,document.getElementById('game-matrix'));