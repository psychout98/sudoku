import React from 'react';
import _ from 'underscore';
import axios from 'axios';

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {time: Date.now(), current: 1, hov: [-1, -1, false], board: [],
            won: false, difficulty: this.props.difficulty};
        this.getborder = this.getborder.bind(this);
        this.hovering = this.hovering.bind(this);
        this.select = this.select.bind(this);
        this.setCurrent = this.setCurrent.bind(this);
        this.checkBoard = this.checkBoard.bind(this);
        this.win = this.win.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', (e) => this.setCurrent(Number(e.key)));
        document.addEventListener('wheel', (e) => this.setCurrent(this.state.current + (e.deltaY / 100)));
        var matrix = [];
        axios.get(this.props.board === null ?
            `https://sugoku.herokuapp.com/board?difficulty=${this.props.difficulty}`
            : `/board?id=${this.props.board}`)
            .then((result) => {
            this.setState({board: result.data.board,
                    difficulty: result.data.difficulty || this.state.difficulty});
            if (this.props.board === null) {
                axios.post('/board', {board: result.data.board, difficulty: this.props.difficulty})
                    .then((data) => {
                        this.props.setId(data.data);
                });
            }
        for (var i = 0; i < 9; i++) {
            var row = [];
            for (var j = 0; j < 9; j++) {
                var value = this.state.board[i][j];
                var square = {i: i, j: j,
                    val: value, current: value === 0 ? 10 : value, show: value === 0 ? '' : value,
                    border: this.getborder(i, j),
                    corners: [],
                    bgc: 'white'};
                var corners = ['ct cl', 'ct cc', 'ct cr', 'cm cl', 'cm cr', 'cb cl', 'cb cc', 'cb cr'];
                for (var k = 0; k < 8; k++) {
                    square.corners[k] = [10, corners[k]];
                }
                row.push(square);
            }
            matrix.push(row);
        }
        this.setState({matrix: matrix});
    });
    }

    componentDidUpdate() {
    }

    checkBoard() {
        var chunks = [{},{},{},{},{},{},{},{},{}];
        var rows = [{},{},{},{},{},{},{},{},{}];
        var cols = [{},{},{},{},{},{},{},{},{}];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var a = 0; a < 3; a++) {
                    for (var b = 0; b < 3; b++) {
                        if (rows[3*i + j][this.state.board[3*i + j][3*a + b]]) {
                            return false;
                        } else {
                            rows[3*i + j][this.state.board[3*i + j][3*a + b]] = true;
                        }
                        if (cols[3*a + b][this.state.board[3*a + b][3*i + j]]) {
                            return false;
                        } else {
                            cols[3*a + b][this.state.board[3*a + b][3*i + j]] = true;
                        }
                        if (chunks[3*i + j][this.state.board[3*i + a][3*j + b]]) {
                            return false;
                        } else {
                            chunks[3*i + j][this.state.board[3*i + a][3*j + b]] = true;
                        }
                    }
                }
            }
        }
        return true;
    }

    setCurrent(value) {
        if (value >= 0 && value < 10) {
            this.setState({current: value});
        }
        if (this.state.hov[2]) {
            this.hovering(this.state.hov[0], this.state.hov[1], true);
        }
    }

    getborder(i, j) {
        var result = '';
        if (j === 2 || j === 5 || j === 8) {
            result = result + ' right-edge';
        }
        if (j === 0 || j === 3 || j === 6) {
            result = result + ' left-edge';
        }
        if (i === 2 || i === 5 || i === 8) {
            result = result + ' bottom-edge';
        }
        if (i === 0 || i === 3 || i === 6) {
            result = result + ' top-edge';
        }
        return result;
    }

    hovering (i, j, on) {
        var matrix = this.state.matrix;
        matrix[i][j].bgc = on ? 'yellow' : 'white';
        var current = Math.floor(this.state.current);
        matrix[i][j].show = matrix[i][j].current > 9 ? on ? current > 0 ? current : 'X' : ''
            : current === 0  && on ? 'X' : matrix[i][j].current;
        if (matrix[i][j].current < 10) {
            matrix[i][j].corners[0][0] = on && current !== matrix[i][j].current ?
                current > 0 ? current : 'X' : 10;
        }
        this.setState({matrix: matrix, hov: [i, j, on]});
    }

    select(i, j, e, rc) {
        e.preventDefault();
        var matrix = this.state.matrix;
        var board = this.state.board;
        var current = Math.floor(this.state.current);
        if (current > 0) {
            if (rc) {
                if (matrix[i][j].current === 10) {
                    var k = 0;
                    var f = -1;
                    while (k < 7 && matrix[i][j].corners[k][0] < 10) {
                        if (matrix[i][j].corners[k][0] === current) {
                            f = k;
                        }
                        k++;
                    }
                    if (f < 0) {
                        matrix[i][j].corners[k][0] = current;
                    } else {
                        matrix[i][j].corners[f][0] = 10;
                    }
                }
            } else {
                matrix[i][j].current = current;
                for (var k = 0; k < 8; k++) {
                    matrix[i][j].corners[k][0] = 10;
                }
            }
        } else {
            matrix[i][j].current = 10;
            for (var k = 0; k < 8; k++) {
                matrix[i][j].corners[k][0] = 10;
            }
        }
        board[i][j] = current === 10 ? 0 : current;
        this.setState({matrix: matrix, board: board});
        if (this.state.hov[2]) {
            this.hovering(this.state.hov[0], this.state.hov[1], true);
        }
        if (this.checkBoard()) {
            this.win();
        }
    }

    win() {
        var matrix = this.state.matrix;
        for (var row of matrix) {
            for (var square of row) {
                square.val = square.current;
                square.bgc = 'white';
            }
        }
        var time = Date.now() - this.state.time;
        var mins = Math.floor(time / 60000);
        var s = Math.floor((time % 60000) / 1000);
        var ms = Math.floor((time % 1000) / 100);
        if (mins > 0) {
            time = mins + ':' + (s < 10 ? '0' + s : s) + '.' + ms + ' minutes';
        } else {
            time = s + '.' + ms + ' seconds';
        }
        this.setState({matrix: matrix, won: true, time: time});
        //this.props.win(this.state.board);
    }

    render() {
        return (<div className="board">{_.map(this.state.matrix, (row) => {
            return _.map(row, (square) => {
                return <div key={square.i + '' + square.j} className={`square${square.border}`}
                        style={{top: square.i*50, left: square.j*50,
                        backgroundColor: square.bgc}}
                        onMouseEnter={square.val === 0 ? () => this.hovering(square.i, square.j, true) : null}
                        onMouseLeave={square.val === 0 ? () => this.hovering(square.i, square.j, false) : null}
                        onClick={square.val === 0 ? (e) => this.select(square.i, square.j, e, false) : null}
                        onContextMenu={square.val === 0 ? (e) => this.select(square.i, square.j, e, true) : null}>
                        {square.show}
                        {_.map(square.corners, (corner) => {
                            if (corner[0] < 10) {
                                return <div className={`corner ${corner[1]}`} key={corner[1]}>{corner[0]}</div>;
                            }
                        })}
                    </div>;
            });
        })}
            {this.state.won ? <div>
                <div className="winner"/>
                <div className="endgame">
                Nailed it! You solved that puzzle in {this.state.time}
                </div>
            </div> : null}
        </div>);
    }
}

export default Board;