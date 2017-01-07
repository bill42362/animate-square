// App.js
'use strict'
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { Actions, Reducer, Component } from 'animate-square';
import React from 'react';
import ReactDOM from 'react-dom';

var onReadyStateChange = function onReadyStateChange(e) {
    if(document.readyState == 'complete') {
        let animateSquaresStore = createStore(Reducer);
        for(let i = 0; i < 30; ++i) {
            animateSquaresStore.dispatch(Actions.addRandomSquare());
        }
        let ConnectedComponent = connect(state => { return {squares: state}; })(Component);
        let goNextStep = () => {
            animateSquaresStore.dispatch(Actions.goNextStep());
            window.requestAnimationFrame(goNextStep);
        }
        ReactDOM.render(
            <Provider store={animateSquaresStore} >
                <ConnectedComponent canvasProps={{style: {backgroundColor: 'rgb(220, 220, 220)'}}} />
            </Provider>,
            document.getElementById('app-root'),
            () => { window.requestAnimationFrame(goNextStep); }
        );
    }   
};
document.addEventListener('readystatechange', onReadyStateChange);
