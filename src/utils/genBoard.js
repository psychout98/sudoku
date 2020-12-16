var tries = 0;

var generateBoard = () => {
    var matrix;
    var rows = [{},{},{},{},{},{},{},{},{}];
    var cols = [{},{},{},{},{},{},{},{},{}];
    var chunks = [{},{},{},{},{},{},{},{},{}];
    var nums = {};
    var reset = () => {
        matrix = [];
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
    }
    var steps = 0;
    var populate = () => {
    reset();
    var broken = false;
    for (var i = 1; i < 10; i++) {
        while (nums[i] < 9) {
            var x = Math.floor(Math.random() * 9);
            var y = Math.floor(Math.random() * 9);
            var c = Math.floor(y / 3) + (3 * Math.floor(x / 3));
            var n = 0, m = 0;
            while (matrix[x][y] > 0 || rows[x][i] > 0 || cols[y][i] > 0) {
                m++;
                if (m > 80) {
                    broken = true;
                    break;
                }
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
            rows[x][i]++;
            cols[y][i]++;
            nums[i]++;
        }
    }
    if (broken && steps < 5000) {
        steps++;
        populate();
    }
    }
    populate();
    var badChunks = (board) => {
        var chunks = [{},{},{},{},{},{},{},{},{}];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var a = 0; a < 3; a++) {
                    for (var b = 0; b < 3; b++) {
                        if (chunks[3*i + j][board[3*i + a][3*j + b]]) {
                            return true;
                        } else {
                            chunks[3*i + j][board[3*i + a][3*j + b]] = true;
                        }
                    }
                }
            }
        }
        return false;
    }
    var shuffle = (board, n) => {
        var shuffled = [];
        var used = {};
        for (var i=0;i<9;i++) {
            used[i] = false;
        }
        while (shuffled.length < 9) {
            var i = Math.floor(Math.random()*9);
            while (used[i]) {
                i++;
                if (i >= 9) {
                    i = 0;
                }
            }
            shuffled.push(board[i]);
            used[i] = true;
        }
        var flip = [];
        for (var i=0;i<9;i++) {
            flip.push([]);
            for(var j=0;j<9;j++) {
                flip[i].push(board[j][i]);
            }
        }
        if (n < 5000 && badChunks(shuffled)) {
            return shuffle(flip, n + 1);
        } else {
            return shuffled;
        }
    }
    var shuff = shuffle(matrix, 0);
    var n = 0;
    while (badChunks(shuff) && n < 50) {
        n++;
        if (n % 500 === 0) {
            console.log(n);
        }
        shuff = shuffle(matrix, 0);
    }
    return matrix;
}

console.log(generateBoard());


export default generateBoard;