// AnimateBoxes.js
let lastTimestamp = Date.now();
const goNextStep = () => {
    let duration = Date.now() - lastTimestamp;
    lastTimestamp += duration;
    return {
        type: 'GO_NEXT_STEP',
        duration: duration
    };
};
const addRandomBox = () => { return { type: 'ADD_RANDOM_BOX' }; };
const addBox = (box) => { return { type: 'ADD_BOX', box: box }; };

const animateBoxesReducer = (state = [], action) => {
    switch(action.type) {
        case 'GO_NEXT_STEP':
            return state.map(box => {
                const center = {
                    x: box.center.x + box.speed.x*action.duration/1000,
                    y: box.center.y + box.speed.y*action.duration/1000,
                };
                if(2 < center.x) { center.x = center.x - 3; }
                else if(-1 > center.x) { center.x = center.x + 3; }
                if(2 < center.y) { center.y = center.y - 3; }
                else if(-1 > center.y) { center.y = center.y + 3; }
                return Object.assign({}, box, { center });
            });
        case 'ADD_RANDOM_BOX':
            let box = {
                aVector: {x: Math.random(), y: Math.random()},
                center: {x: 3*Math.random() - 1, y: 3*Math.random() - 1},
                color: {red: 128, green: 128, blue: 128, alpha: 0.1},
                speed: {x: 0.1*Math.random() - 0.05, y: 0.1*Math.random() - 0.05},
                rotation: Math.random(),
            };
            return [...state, box];
        case 'ADD_BOX':
            return [...state, action.box];
        default:
            return state;
    }
}

export default {
    goNextStep, addBox, addRandomBox,
    reducer: animateBoxesReducer
};
