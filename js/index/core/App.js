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
        for(let i = 0; i < 10; ++i) {
            animateBoxesStore.dispatch(AnimateBoxes.addRandomBox());
        }
        let ConnectedBoxCanvas = connect(state => { return {boxes: state}; })(BoxCanvas);
        ReactDOM.render(
            <Provider store={animateBoxesStore} >
                <ConnectedBoxCanvas canvasProps={{style: {backgroundColor: 'black'}}} />
            </Provider>,
            document.getElementById('app-root')
        );
    }   
};
document.addEventListener('readystatechange', onReadyStateChange);
