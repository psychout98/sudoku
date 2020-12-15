import React from 'react';
import _ from 'underscore';
import Board from './board';

class App extends React.Component {
    
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div>
                <Board/>
            </div>
        );
    }
}

export default App;