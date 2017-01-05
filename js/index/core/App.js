// App.js
'use strict'
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import AnimateSquares from './AnimateSquares.js';
import SquareCanvas from '../../common/react/SquareCanvas.react.js';
var ReactDOM = require('react-dom');
var Core = require('../../common/core/Core.js');


var onReadyStateChange = function onReadyStateChange(e) {
    if(document.readyState == 'complete') {
        let animateSquaresStore = createStore(AnimateSquares.reducer);
        for(let i = 0; i < 30; ++i) {
            animateSquaresStore.dispatch(AnimateSquares.addRandomSquare());
        }
        let ConnectedSquareCanvas = connect(state => { return {squares: state}; })(SquareCanvas);
        let goNextStep = () => {
            animateSquaresStore.dispatch(AnimateSquares.goNextStep());
            window.requestAnimationFrame(goNextStep);
        }
        ReactDOM.render(
            <Provider store={animateSquaresStore} >
                <ConnectedSquareCanvas canvasProps={{style: {backgroundColor: 'rgb(220, 220, 220)'}}} />
            </Provider>,
            document.getElementById('app-root'),
            () => { window.requestAnimationFrame(goNextStep); }
        );
    }   
};
document.addEventListener('readystatechange', onReadyStateChange);
