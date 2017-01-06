# animate-square
Animator of squares with canvas.",

### Installation
```bash
npm install --save animate-square
```
### Usage
```js
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { Actions, Reducer, Component } from 'animate-square';
import ReactDOM from 'react-dom';

// Create store.
const animateSquaresStore = createStore(Reducer);

// Add 30 random (position, size, moving direction) squares.
for(let i = 0; i < 30; ++i) {
    animateSquaresStore.dispatch(Actions.addRandomSquare());
}

// Make container component.
const ConnectedComponent = connect(state => { return {squares: state}; })(Component);

// Animation.
const onReactDOMRendered = function() {
    const goNextStep = () => {
        // Use `Actions.goNextStep()` to move squares with timestamp.
        animateSquaresStore.dispatch(Actions.goNextStep());
        window.requestAnimationFrame(goNextStep);
    }   
    window.requestAnimationFrame(goNextStep);
}

ReactDOM.render(
    <Provider store={animateSquaresStore} >
        <ConnectedComponent canvasProps={{style: {backgroundColor: 'rgb(220, 220, 220)'}}} />
    </Provider>,
    document.getElementById('app-root'),
    onReactDOMRendered
);
```
