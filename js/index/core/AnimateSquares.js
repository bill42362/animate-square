// AnimateSquares.js
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

const animateSquaresReducer = (state = [], action) => {
    switch(action.type) {
        case 'GO_NEXT_STEP':
            return state.map(square => {
                const center = {
                    x: square.center.x + square.speed.x*action.duration/1000,
                    y: square.center.y + square.speed.y*action.duration/1000,
                };
                if(2 < center.x) { center.x = center.x - 3; }
                else if(-1 > center.x) { center.x = center.x + 3; }
                if(2 < center.y) { center.y = center.y - 3; }
                else if(-1 > center.y) { center.y = center.y + 3; }
                return Object.assign({}, square, { center });
            });
        case 'ADD_RANDOM_SQUARE':
            let square = {
                aVector: {x: Math.random(), y: Math.random()},
                center: {x: 3*Math.random() - 1, y: 3*Math.random() - 1},
                color: {red: 128, green: 128, blue: 128, alpha: 0.1},
                speed: {x: 0.1*Math.random() - 0.05, y: 0.1*Math.random() - 0.05},
                rotation: Math.random(),
            };
            return [...state, square];
        case 'ADD_SQUARE':
            return [...state, action.square];
        default:
            return state;
    }
}

export default {
    goNextStep, addSquare, addRandomSquare,
    reducer: animateSquaresReducer
};
