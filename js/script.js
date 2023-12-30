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
var state = [];


var turn = CellState.Red;
var ended = false;
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

    // register dom events.
    registerEvents();
}
function registerEvents() {
    var cells = document.getElementsByClassName("cell");
    for (var i = 0; i < cells.length; i++) {
        (function (index) {
            cells[index].addEventListener("click", function (event) {
                let column = event.target.getAttribute("column");
                play(parseInt(column));
            })
        })(i);
    }
}
function buildHTMLBoard(row, column) {
    const elem = document.getElementById(htmlBoardContainerID);
    var boardHTML = "";
    for (let i = row-1; i >= 0; i--) {
        for (let j = 0; j < column; j++) {
            boardHTML += `<div column="${j}" id="${buildCellID(i,j)}" class="cell"></div>`;
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
function play(column) {
    if (ended) {
        return;
    }
    row = findAvailableCell(column);
    if (row === undefined || row == -1) {
        console.info("could not found available cell.")
        return -1;
    }

    console.info("found available space:" + row, column);
    setCell(turn, row, column);
    const [indexes, isWin] = is4InRow(turn, row, column);
    if (isWin) {
        ended = true;
        animateWinnerLine(indexes);
        alert(`${turn} wins the game! Conguralations!`);
        return;
    }


    if (turn == CellState.Red) {
        turn = CellState.Yellow;
    } else {
        turn = CellState.Red;
    }
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
    let cssCls = getColorCSSClass(color);
    setCellCSS(cssCls, row, column);
}
function setCellCSS(cssCls, row, column) {
    const elem = document.getElementById(buildCellID(row, column));
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

function animateWinnerLine(indexes) {
    indexes.forEach(function (item, index) {
        setCellCSS("pulse", item.row, item.column);
        setCellCSS("blue", item.row, item.column);
    });
}
/**
 * Finds if there is a 4 in a row. 
 *
 * @param {number} color The color of the token.
 * @param {number} row The row that player wants to put the token.
 * @param {number} column The column that player wants to put the token to column.
 * 
 */
function is4InRow(color, row, column) {
    let counter = 0;
    let indexes = [];
    // check left & right of the token
    for (let i = column - 3 < 0 ? 0 : column - 3; i < state[0].length; i++) {
        if (state[row][i] == color) {
            counter++;
            indexes.push({ "row": row, "column": i });
            if (counter == 4) {
                return [indexes, true];
            }
            continue;
        }
        indexes = [];
        counter = 0;
    }


    counter = 0;
    indexes = [];
    // check down of the token
    for (let i = row; i >= 0; i--) {
        if (state[i][column] == color) {
            counter++;
            indexes.push({ "row": i, "column": column });
            if (counter == 4) {
                return [indexes, true];
            }
            continue;
        }
        break;
    }

    counter = 0;
    indexes = [];
    // check cross of the token, left-down, right-down, left-up, right-up.
    let step = Math.min(column > 3 ? 3 : column, (state.length -1) - row);
    let ci = column - step;
    let ri = row + step;
    for (; ri >= 0; ri--) {
        c = state[ri][ci];
        if (c == color) {
            indexes.push({ "row": ri, "column": ci });
            counter++;
            if (counter == 4) {
                return [indexes, true];
            }
            ci++;
            continue;
        }
        ci++;
        counter = 0;
    }

    counter = 0;
    indexes = [];
    step = Math.min(column > 3 ? 3 : column, row > 3 ? 3 : row);
    ci = column - step;
    ri = row - step;
    for (; ri < state.length; ri++) {
        c = state[ri][ci];
        if (c == color) {
            indexes.push({ "row": ri, "column": ci });
            counter++;
            if (counter == 4) {
                return [indexes, true];
            }
            ci++;
            continue;
        }
        ci++;
        counter = 0;
    }

    return [indexes, false];
}
