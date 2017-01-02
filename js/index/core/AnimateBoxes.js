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
                return Object.assign({}, box, {
                    a: {
                        x: box.a.x + box.speed.x*action.duration,
                        y: box.a.y + box.speed.y*action.duration
                    },
                    center: {
                        x: box.center.x + box.speed.x*action.duration,
                        y: box.center.y + box.speed.y*action.duration
                    },
                });
            });
        case 'ADD_RANDOM_BOX':
            let box = {
                a: {x: 600*Math.random(), y: 600*Math.random()},
                center: {x: 600*Math.random(), y: 300*Math.random()},
                color: {red: 128, green: 128, blue: 128, alpha: 0.1},
                speed: {x: Math.random(), y: Math.random()},
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
