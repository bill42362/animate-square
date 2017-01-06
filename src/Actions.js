// Actions.js
'use strict'
let lastTimestamp = Date.now();
const goNextStep = () => {
    let duration = Date.now() - lastTimestamp;
    lastTimestamp += duration;
    return {
        type: 'GO_NEXT_STEP',
        duration: duration
    };
};
const addRandomSquare = () => { return { type: 'ADD_RANDOM_SQUARE' }; };
const addSquare = (square) => { return { type: 'ADD_SQUARE', square: square }; };

export { goNextStep, addSquare, addRandomSquare };
export default { goNextStep, addSquare, addRandomSquare };
