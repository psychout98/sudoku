import React from 'react';
import _ from 'underscore';

class Board extends React.Component {

    constructor() {
        super();
        this.state = {current: 1, hov: [-1, -1, false]};
        this.getborder = this.getborder.bind(this);
        this.hovering = this.hovering.bind(this);
        this.select = this.select.bind(this);
        this.setCurrent = this.setCurrent.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', (e) => this.setCurrent(Number(e.key)));
        document.addEventListener('wheel', (e) => this.setCurrent(this.state.current + (e.deltaY / 25)));
        var matrix = [];
        for (var i = 0; i < 9; i++) {
            var row = [];
            for (var j = 0; j < 9; j++) {
                var square = {i: i, j: j,
                    val: 10, current: 10, show: '',
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
        console.log(matrix);
        this.setState({matrix: matrix});
    }

    componentDidUpdate() {

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
        this.setState({matrix: matrix});
        if (this.state.hov[2]) {
            this.hovering(this.state.hov[0], this.state.hov[1], true);
        }
    }

    render() {
        return (<div className="board">{_.map(this.state.matrix, (row) => {
            return _.map(row, (square) => {
                return <div key={square.i + '' + square.j} className={`square${square.border}`}
                        style={{top: square.i*50, left: square.j*50,
                        backgroundColor: square.bgc}}
                        onMouseEnter={() => this.hovering(square.i, square.j, true)}
                        onMouseLeave={() => this.hovering(square.i, square.j, false)}
                        onClick={(e) => this.select(square.i, square.j, e, false)}
                        onContextMenu={(e) => this.select(square.i, square.j, e, true)}>
                        {square.show}
                        {_.map(square.corners, (corner) => {
                            if (corner[0] < 10) {
                                return <div className={`corner ${corner[1]}`} key={corner[1]}>{corner[0]}</div>;
                            }
                        })}
                    </div>;
            });
        })}</div>);
    }
}

export default Board;