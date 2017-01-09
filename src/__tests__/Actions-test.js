// Actions-test-js
'use strict';
import deepFreeze from 'deep-freeze';
import Actions from '../Actions.js';

describe('Actions.addSquare', () => {
    it('should return an action to add argument square.', () => {
        const baseSquare = {
            aVector: {x: 1, y: 0},
            center: {x: 0, y: 0},
            color: {red: 128, green: 128, blue: 128, alpha: 0.1},
            speed: {x: 0.1, y: 0.1},
            rotation: 0.1,
        };
        deepFreeze(baseSquare);
        expect(
            Actions.addSquare(baseSquare)
        ).toEqual({
            type: 'ADD_SQUARE',
            square: baseSquare
        });
    });
    it('should return an action to add random square.', () => {
        expect(
            Actions.addRandomSquare()
        ).toEqual({
            type: 'ADD_RANDOM_SQUARE',
        });
    });
    it('should return an action to go next step with duration.', () => {
        const actionTimestamp = Date.now();
        const action = Actions.goNextStep();
        for(let i = 0; i < 1000000; ++i) { let j = i*2/3; }
        const nextActionTimestamp = Date.now();
        const nextAction = Actions.goNextStep();
        const globalDuration = nextActionTimestamp - actionTimestamp;
        expect(action.type).toEqual('GO_NEXT_STEP');
        expect(Math.abs(nextAction.duration - globalDuration)).toBeLessThanOrEqual(3);
    });
});
