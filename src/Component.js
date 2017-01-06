// Component.react.js
'use strict'
import React from 'react';
export default class Component extends React.Component {
    constructor(props) {
        super(props);
        this.antialiasingFactor = 2;
        this.rectMatrixes = [0.5, 1, 1.5].map(angle => angle*Math.PI).map(arc => {
            return {
                m11: Math.cos(arc), m12: -Math.sin(arc),
                m21: Math.sin(arc), m22: Math.cos(arc),
            };
        });
        this.squareStack = [];
        this.context = undefined;
        this.clearCanvas = this.clearCanvas.bind(this);
        this.drawProps = this.drawProps.bind(this);
        this.drawSquareStack = this.drawSquareStack.bind(this);
    }
    getStyleFromRGB({red = 0, green = 0, blue = 0}) {
        return `rgb(${Math.floor(red)},${Math.floor(green)},${Math.floor(blue)})`;
    }
    pushSquareStack(points = [], style = '#888', alpha = 1) {
        this.squareStack.push({points: points, fillStyle: style, globalAlpha: alpha });
    }
    drawSquareStack(ctx) {
        let stack = this.squareStack.sort((a, b) => {
            if(a.fillStyle > b.fillStyle) return 1; 
            if(a.fillStyle < b.fillStyle) return -1; 
            if(a.globalAlpha > b.globalAlpha) return 1; 
            if(a.globalAlpha < b.globalAlpha) return -1; 
        });
        let tempFillStyle = ctx.fillStyle;
        let tempGlobalAlpha = ctx.globalAlpha;
        ctx.beginPath();
        stack.forEach(square => {
            let current = {
                fillStyle: ctx.fillStyle,
                globalAlpha: ctx.globalAlpha,
            };
            if(current.fillStyle !== square.fillStyle || current.globalAlpha !== square.globalAlpha) {
                ctx.fill();
                if(current.fillStyle !== square.fillStyle) ctx.fillStyle = square.fillStyle;
                if(current.globalAlpha !== square.globalAlpha) ctx.globalAlpha = square.globalAlpha;
                ctx.beginPath();
            }
            ctx.moveTo(square.points[square.points.length - 1].x, square.points[square.points.length - 1].y);
            square.points.forEach(point => { ctx.lineTo(point.x, point.y); });
        });
        ctx.fill();
        ctx.fillStyle = tempFillStyle;
        ctx.globalAlpha = tempGlobalAlpha;
        this.squareStack = [];
    }
    drawProps(props, context) {
        this.clearCanvas(context);
        const unit = Math.max(this.canvas.width, this.canvas.height);
        let rectangles = props.squares.map(square => {
            const center = {x: unit*square.center.x, y: unit*square.center.y};
            const aVector = {x: unit*square.aVector.x, y: unit*square.aVector.y};
            let a = {x: center.x + aVector.x, y: center.y + aVector.y};
            return {
                points: [a, ...this.rectMatrixes.map(matrix => {
                    return {
                        x: center.x + aVector.x*matrix.m11 + aVector.y*matrix.m12,
                        y: center.y + aVector.x*matrix.m21 + aVector.y*matrix.m22,
                    };
                })],
                color: square.color,
            };
        });
        rectangles.forEach(square => {
            this.pushSquareStack(square.points, this.getStyleFromRGB(square.color), square.color.alpha);
        });
        this.drawSquareStack(context);
    }
    clearCanvas(context) {
        let canvas = this.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    componentDidMount() {
        let antialiasingFactor = this.antialiasingFactor;
        let canvas = this.refs.canvas;
        this.canvas = this.refs.canvas;
        this.context = canvas.getContext('2d');
        this.context.canvas.width = antialiasingFactor*canvas.clientWidth;
        this.context.canvas.height = antialiasingFactor*canvas.clientHeight;
        this.context.translate(0.5, 0.5);
        this.context.font = "32px Helvetica Neue,Helvetica,Arial,sans-serif";
        this.drawProps(this.props, this.context);
    }
    componentWillReceiveProps(nextProps) {
        let context = this.canvas.getContext('2d');
        this.drawProps(nextProps, context);
    }
    render() { return <canvas ref='canvas' {...this.props.canvasProps} ></canvas>; }
}
