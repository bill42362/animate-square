// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import BoxCanvas from '../../common/react/BoxCanvas.react.js';

class App extends React.Component {
    constructor(props) { super(props); }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        let boxes = [];
        for(let i = 0; i < 10; ++i) {
            boxes.push({
                a: {x: 600*Math.random(), y: 600*Math.random()},
                center: {x: 600*Math.random(), y: 300*Math.random()},
                color: {red: 128, green: 128, blue: 128, alpha: 0.1},
            });
        }
        return <div id='wrapper' ref='base' >
            <BoxCanvas
                canvasProps={{style: {backgroundColor: 'rgb(220, 220, 220)'}}}
                boxes={boxes}
            />
        </div>;
    }
}
module.exports = App;
