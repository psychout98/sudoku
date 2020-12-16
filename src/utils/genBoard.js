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
            rows[i][j + 1] = 0;
            cols[i][j + 1] = 0;
            chunks[i][j + 1] = 0;
            row.push(0);
        }
        matrix.push(row);
    }
    for (var i = 1; i < 10; i++) {
        while (nums[i] < 9) {
            var x = Math.floor(Math.random() * 9);
            var y = Math.floor(Math.random() * 9);
            var n = 0;
            while (matrix[x][y] > 0) {
                n++;
                if (n > 8) {
                    n = 0;
                    y++;
                    if (y > 8) {
                        y = 0;
                    }
                }
                x++;
                if (x > 8) {
                    x = 0;
                }
            }
            matrix[x][y] = i;
        }
    }
    var c = Math.floor(Math.random() * 9);
    var xi = 3 * ((c + 1) % 3);
    var yi = 3 * Math.floor(c / 3);
    var x = Math.floor(Math.random() * 3);
    var y = Math.floor(Math.random() * 3);
    return matrix;
}


export default generateBoard;