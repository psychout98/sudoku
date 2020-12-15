import { chunk } from "underscore";

const generateBoard = () => {
    var matrix = [];
    var rows = [{},{},{},{},{},{},{},{},{}];
    var cols = [{},{},{},{},{},{},{},{},{}];
    var chunks = [{},{},{},{},{},{},{},{},{}];
    var nums = {};
    for (var i = 0; i < 9; i++) {
        var row = [];
        nums[i + 1] = 0;
        for (var j = 0; j < 9; j++) {
            rows[i][j + 1] = false;
            cols[i][j + 1] = false;
            chunks[i][j + 1] = false;
            row.push(0);
        }
        matrix.push(row);
    }
    var steps = 0;
    for (var i = 1; i < 2; i++) {
    while (nums[i] < 9) {
        var c = Math.floor(Math.random() * 9);
        while (chunks[c][i]) {
            c++;
            if (c > 8) {
                c = 0;
            }
        }
        var xi = 3 * ((c + 1) % 3);
        var yi = 3 * Math.floor(c / 3);
        var x = Math.floor(Math.random() * 3);
        var y = Math.floor(Math.random() * 3);
        while (cols[xi + x][i]) {
            x++;
            if (x > 3) {
                x = 0;
            }
        }
        while (rows[yi + y][i]) {
            y++;
            if (y > 3) {
                y = 0;
            }
        }
        cols[xi + x][i] = true;
        rows[yi + y][i] = true;
        if (matrix[yi + y][xi + x] > 0) {
            nums[matrix[yi + y][xi + x]]--;
        }
        matrix[yi + y][xi + x] = i;
        nums[i]++;
    }
    }
    return matrix;
}

const hasConflicts = (matrix, i, j, val) => {
    var rows = matrix;
    rows[i][j] = val;
    var cols = [[],[],[],[],[],[],[],[],[]];
    var chunks = [];
    for (var k = 0; k < 9; k++) {
        for (var l = 0; l < 9; l++) {
            cols[l][k] = rows[k][l];
        }
    }
    for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
            var chunk = [];
            for (var a = 0; a < 3; a++) {
                for (var b = 0; b < 3; b++) {
                    chunk.push(rows[(3 * l) + b][(3 * k) + a]);
                }
            }
            chunks.push(chunk);
        }
    }
    for (var k = 0; k < 9; k++) {
        var row = {};
        var col = {};
        var chunk = {};
        for (var l = 0; l < 9; l++) {
            if (row[rows[k][l]] && rows[k][l] !== 0) {
                return true;
            } else {
                row[rows[k][l]] = true;
            }
            if (col[cols[k][l]] && cols[k][l] !== 0) {
                return true;
            } else {
                col[cols[k][l]] = true;
            }
            if (chunk[chunks[k][l]] && cols[k][l] !== 0) {
                return true;
            } else {
                chunk[chunks[k][l]] = true;
            }
        }
    }
    return false;
}

export default generateBoard;