// App.js
'use strict'
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import AnimateBoxes from './AnimateBoxes.js';
import BoxCanvas from '../../common/react/BoxCanvas.react.js';
var ReactDOM = require('react-dom');
var Core = require('../../common/core/Core.js');


var onReadyStateChange = function onReadyStateChange(e) {
    if(document.readyState == 'complete') {
        let animateBoxesStore = createStore(AnimateBoxes.reducer);
        for(let i = 0; i < 30; ++i) {
            animateBoxesStore.dispatch(AnimateBoxes.addRandomBox());
        }
        let ConnectedBoxCanvas = connect(state => { return {boxes: state}; })(BoxCanvas);
        let goNextStep = () => {
            animateBoxesStore.dispatch(AnimateBoxes.goNextStep());
            window.requestAnimationFrame(goNextStep);
        }
        ReactDOM.render(
            <Provider store={animateBoxesStore} >
                <ConnectedBoxCanvas canvasProps={{style: {backgroundColor: 'rgb(220, 220, 220)'}}} />
            </Provider>,
            document.getElementById('app-root'),
            () => { window.requestAnimationFrame(goNextStep); }
        );
    }   
};
document.addEventListener('readystatechange', onReadyStateChange);
