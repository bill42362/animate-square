// App.js
'use strict'
import { createStore } from 'redux';
import AnimateBoxes from './AnimateBoxes.js';
var ReactDOM = require('react-dom');
var Core = require('../../common/core/Core.js');
var Wrapper = require('../react/App.react.js');

var onReadyStateChange = function onReadyStateChange(e) {
    if(document.readyState == 'complete') {
        let animateBoxesStore = createStore(AnimateBoxes.reducer);
        for(let i = 0; i < 10; ++i) {
            animateBoxesStore.dispatch(AnimateBoxes.addRandomBox());
        }
        console.table(animateBoxesStore.getState());
        ReactDOM.render(<Wrapper />, document.getElementById('app-root'));
    }   
};
document.addEventListener('readystatechange', onReadyStateChange);
