// Actions-test-js
'use strict';
import React from 'react';
import { shallow } from 'enzyme';
import Component from '../Component.js';

const canvasProps = {className: 'canvas', style: {backgroundColor: 'gray'}};
function setup() {
    const props = { canvasProps };
    const enzymeWrapper = shallow(<Component {...props} />);
    return { props, enzymeWrapper };
}

describe('Component', () => {
    it('should inject canvasProps from props to canvas.', () => {
        const { enzymeWrapper, props } = setup();
        expect(enzymeWrapper.find('canvas').hasClass('canvas')).toBe(true);
        expect(enzymeWrapper.find('canvas').props()).toEqual(canvasProps);
    });
});
