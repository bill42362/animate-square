// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class App extends React.Component {
    constructor(props) { super(props); }
    componentDidMount() { }
    componentWillUnmount() { }
    render() { return <div id='wrapper' ref='base' ></div>; }
}
module.exports = App;
