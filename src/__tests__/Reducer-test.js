// Reducer-test-js
'use strict';
import deepFreeze from 'deep-freeze';
import Reducer from '../Reducer';

describe('Reducer', () => {
    const baseSquare = {
        aVector: {x: 1, y: 0},
        center: {x: 0, y: 0},
        color: {red: 128, green: 128, blue: 128, alpha: 0.1},
        speed: {x: 0.1, y: 0.1},
        rotation: 0.1,
    };
    deepFreeze(baseSquare);
    it('should return an empty array as the initial state.', () => {
        expect(Reducer(undefined, {})).toEqual([]);
    });
    it('should add argument square to array tail with \'ADD_SQUARE\' action.', () => {
        const initialState = [];
        deepFreeze(initialState);
        const state = Reducer(initialState, {
            type: 'ADD_SQUARE',
            square: baseSquare,
        });
        expect(
            state
        ).toHaveLength(
            initialState.length + 1
        );
        expect(
            state
        ).toEqual(
            [...initialState, baseSquare]
        );
        expect(
            state[state.length - 1]
        ).toBe(
            baseSquare
        );
    });
    it('should add random square to array tail with \'ADD_RANDOM_SQUARE\' action.', () => {
        const initialState = [];
        deepFreeze(initialState);
        const state = Reducer(
            Reducer(initialState, {type: 'ADD_RANDOM_SQUARE'}),
            {type: 'ADD_RANDOM_SQUARE'}
        );
        expect(
            state
        ).toHaveLength(
            initialState.length + 2
        );
        expect(
            state[state.length - 1]
        ).not.toMatchObject(
            state[state.length - 2]
        );
    });
    it('should move squares to (center + action.duration*speed/1000) with \'GO_NEXT_STEP\' action.', () => {
        const initialState = [];
        deepFreeze(initialState);
        const stateBeforeMove = Reducer(
            Reducer(initialState, {type: 'ADD_RANDOM_SQUARE'}),
            {type: 'ADD_RANDOM_SQUARE'}
        );
        deepFreeze(stateBeforeMove);
        const state = Reducer(
            stateBeforeMove,
            {type: 'GO_NEXT_STEP', duration: 1000}
        );
        const lastSquareBeforeMove = stateBeforeMove[stateBeforeMove.length - 1];
        const lastSquare = state[state.length - 1];
        expect(
            lastSquare.center
        ).toMatchObject(
            {
                x: lastSquareBeforeMove.center.x + lastSquareBeforeMove.speed.x,
                y: lastSquareBeforeMove.center.y + lastSquareBeforeMove.speed.y,
            }
        );
        const lastTwoSquareBeforeMove = stateBeforeMove[stateBeforeMove.length - 2];
        const lastTwoSquare = state[state.length - 2];
        expect(
            lastTwoSquare.center
        ).toMatchObject(
            {
                x: lastTwoSquareBeforeMove.center.x + lastTwoSquareBeforeMove.speed.x,
                y: lastTwoSquareBeforeMove.center.y + lastTwoSquareBeforeMove.speed.y,
            }
        );
    });
});
