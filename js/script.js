const CellState = {
    Availabe: 0,
    Red: 1,
    Yellow: 2
}

var htmlBoardContainerID = "board-container";

/**
 * State is a two-dimensial array that holds board state.
 * 
 */
var state = []

/**
 * Builds board and state.
 *
 * @param {number} row Number of rows.
 * @param {number} column Number of columns.
 */
function buildBoard() {
    let r = 6;
    let c = 7;

    for (let i = 0; i < r; i++) {
        state[i] = Array(c).fill(CellState.Availabe)
    }

    // build html board
    buildHTMLBoard(r, c);
}
function buildHTMLBoard(row, column) {
    const elem = document.getElementById(htmlBoardContainerID);
    var boardHTML = "";
    for (let i = row-1; i >= 0; i--) {
        for (let j = 0; j < column; j++) {
            boardHTML += `<div id="${buildCellID(i,j)}" class="cell"></div>`;
        }
    }
    elem.innerHTML = boardHTML;
}
function buildCellID(row, column) {
    return `r-${row}-c-${column}`
}
/**
 * Finds cell in the given column and calculates whether player made 4 in a row.
 *
 * @param {number} color The color player plays.
 * @param {number} column The column that player wants to put the token to column.
 */
function play(color, column) {
    if (color != CellState.Red && color != CellState.Yellow) {
        console.info("please provide correct color.")
        return -1;
    }

    row = findAvailableCell(column);
    if (row === undefined || row == -1) {
        console.info("could not found available cell.")
        return -1;
    }

    console.info("found available space:" + row, column);
    setCell(color, row, column);
    isWin = is4InRow(color, row, column)
    
}

/**
 * Finds lowest available space-cell in the given column.
 *
 * @param {number} column The column that player wants to put the token to column.
 * @return {number} returns the row in the column.
 * 
 */
function findAvailableCell(column) {
    for (let i = 0; i < state.length; i++) {
        if (state[i][column] == CellState.Availabe) {
            return i;
        }
    }
    return -1;
}

/**
 * Sets the given cell css class with the corroesponded player color.
 *
 * @param {number} color The color of the token.
 * @param {number} row The row that player wants to put the token.
 * @param {number} column The column that player wants to put the token to column.
 * @return {number} returns the cell in the column.
 * 
 */
function setCell(color, row, column) {
    state[row][column] = color;
    const elem = document.getElementById(buildCellID(row, column));
    let cssCls = getColorCSSClass(color);
    elem.classList.add(cssCls);
}
function getColorCSSClass(color) {
    if (color == CellState.Red) {
        return "red";
    }
    if (color == CellState.Yellow) {
        return "yellow";
    }
    return "empty";
}
/**
 * Finds if there is a 4 in a row. 
 *
 * @param {number} color The color of the token.
 * @param {number} row The row that player wants to put the token.
 * @param {number} column The column that player wants to put the token to column.
 * 
 */
function is4InRow() {

}
