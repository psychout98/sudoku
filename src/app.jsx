import React from 'react';
import _ from 'underscore';
import Board from './board';

class App extends React.Component {

    constructor() {
        super();
        this.state = {started: false, difficulty: 'easy', board: null,
            buttons: [], authing: false, user: '', pass: ''};
        this.menu = this.menu.bind(this);
        this.game = this.game.bind(this);
        this.login = this.login.bind(this);
        this.fields = this.fields.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.clipId = this.clipId.bind(this);
    }

    componentDidMount() {
        var id = window.location.search.split('?id=')[1] || null;
        if (id === null) {
            var diffs = [{text: 'easy',
                method: () => this.setState({started: true,
                    difficulty: 'easy'}),top: 120},{text: 'medium',
                method: () => this.setState({started: true,
                    difficulty: 'medium'}),top: 210}, {text: 'hard',
                method: () => this.setState({started: true,
                    difficulty: 'hard'}),top: 300}];
            var menu = [{text: 'start a game',
                method: () => this.setState({buttons: diffs}),
                top: 120}, {text: 'sign in', top : 210,
                method: () => this.setState({buttons: 
                    [{text: 'log in / create account',
                    method: this.login, top: 300}], authing: true
                })}];
            diffs.push();
            diffs.push();
            diffs.push();
            menu.push();
            this.setState({buttons: menu});
        } else {
            this.setState({started: true, board: id});
        }
    }

    handleKey(e, field) {
        if (field === 0){
            console.log('user', e);
        } else {
            console.log('pass', e);
        }
    }

    fields() {
        return (
            <div>
                <input className="items" style={{top: 120}}
                    onChange={(e) => this.handleKey(e, 0)}></input>
                <input className="items" style={{top: 210}}
                    onChange={(e) => this.handleKey(e, 1)}></input>
            </div>
            );
    }

    login() {
        this.setState({authing: false});
        console.log(this.state.upass);
    }

    componentDidUpdate() {
    }

    menu() {
        return (
            <div className="menu">
                <div className="title">Welcome to my MVP</div>
                {this.state.authing ? this.fields() : null}
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

    clipId(e) {
        navigator.clipboard.writeText(e.target.value)
            .then(() => window.confirm('Link to this puzzle has been copied to the clipboard'))
                .catch((err) => console.log(err));
    }

    game() {
        return (
            <div>
                <Board difficulty={this.state.difficulty} board={this.state.board}
                setId={(id) => this.setState({board: id})}/>
                {this.state.board === null ? null :
                <button className="share" value={`http://ec2-3-133-125-0.us-east-2.compute.amazonaws.com?id=${this.state.board}`}
                    onClick={this.clipId}>
                    Share puzzle
                </button>}
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