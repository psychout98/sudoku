import React from 'react';
import _ from 'underscore';
import Board from './board';

class App extends React.Component {

    constructor() {
        super();
        this.state = {started: false, difficulty: 'easy', buttons: []};
        this.menu = this.menu.bind(this);
        this.game = this.game.bind(this);
    }

    componentDidMount() {
        var diffs = [{text: 'easy',
            method: () => this.setState({started: true,
                difficulty: 'easy'}),top: 120},{text: 'medium',
            method: () => this.setState({started: true,
                difficulty: 'medium'}),top: 210}, {text: 'hard',
            method: () => this.setState({started: true,
                difficulty: 'hard'}),top: 300}];
        var menu = [{
            text: 'Start a game',
            method: () => this.setState({buttons: diffs}),
            top: 120
        }];
        diffs.push();
        diffs.push();
        diffs.push();
        menu.push();
        this.setState({buttons: menu});
    }

    componentDidUpdate() {
    }

    menu() {
        return (
            <div className="menu">
                <div className="title">Welcome to my MVP</div>
                {_.map(this.state.buttons, (button) => {
                    //console.log(button.method);
                    return (
                        <button className="items" style={{top: button.top}}
                            onClick={button.method} key={button.text}>
                                {button.text}
                        </button>
                    )
                })}
            </div>
        );
    }

    game() {
        return (
            <div>
                <Board difficulty={this.state.difficulty}/>
            </div>
            );
    }

    render() {
        return (
            <div>
                {this.state.started ? this.game() : this.menu()}
            </div>
        );
    }
}

export default App;