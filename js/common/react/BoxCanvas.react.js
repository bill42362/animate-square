// BoxCanvas.react.js
'use strict'
import React from 'react';
class BoxCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.antialiasingFactor = 2;
        this.rectMatrixes = [0.5, 1, 1.5].map(angle => angle*Math.PI).map(arc => {
            return {
                m11: Math.cos(arc), m12: -Math.sin(arc),
                m21: Math.sin(arc), m22: Math.cos(arc),
            };
        });
        this.boxStack = [];
        this.context = undefined;
        this.clearCanvas = this.clearCanvas.bind(this);
        this.drawProps = this.drawProps.bind(this);
        this.drawBoxStack = this.drawBoxStack.bind(this);
    }
    getStyleFromRGB({red = 0, green = 0, blue = 0}) {
        return `rgb(${Math.floor(red)},${Math.floor(green)},${Math.floor(blue)})`;
    }
    pushBoxStack(points = [], style = '#888', alpha = 1) {
        this.boxStack.push({points: points, fillStyle: style, globalAlpha: alpha });
    }
    drawBoxStack(ctx) {
        let stack = this.boxStack.sort((a, b) => {
            if(a.fillStyle > b.fillStyle) return 1; 
            if(a.fillStyle < b.fillStyle) return -1; 
            if(a.globalAlpha > b.globalAlpha) return 1; 
            if(a.globalAlpha < b.globalAlpha) return -1; 
        });
        let tempFillStyle = ctx.fillStyle;
        let tempGlobalAlpha = ctx.globalAlpha;
        ctx.beginPath();
        stack.forEach(box => {
            let current = {
                fillStyle: ctx.fillStyle,
                globalAlpha: ctx.globalAlpha,
            };
            if(current.fillStyle !== box.fillStyle || current.globalAlpha !== box.globalAlpha) {
                ctx.fill();
                if(current.fillStyle !== box.fillStyle) ctx.fillStyle = box.fillStyle;
                if(current.globalAlpha !== box.globalAlpha) ctx.globalAlpha = box.globalAlpha;
                ctx.beginPath();
            }
            ctx.moveTo(box.points[box.points.length - 1].x, box.points[box.points.length - 1].y);
            box.points.forEach(point => { ctx.lineTo(point.x, point.y); });
        });
        ctx.fill();
        ctx.fillStyle = tempFillStyle;
        ctx.globalAlpha = tempGlobalAlpha;
        this.boxStack = [];
    }
    drawProps(props, context) {
        this.clearCanvas(context);
        const unit = Math.max(this.canvas.width, this.canvas.height);
        let rectangles = props.boxes.map(box => {
            const center = {x: unit*box.center.x, y: unit*box.center.y};
            const aVector = {x: unit*box.aVector.x, y: unit*box.aVector.y};
            let a = {x: center.x + aVector.x, y: center.y + aVector.y};
            return {
                points: [a, ...this.rectMatrixes.map(matrix => {
                    return {
                        x: center.x + aVector.x*matrix.m11 + aVector.y*matrix.m12,
                        y: center.y + aVector.x*matrix.m21 + aVector.y*matrix.m22,
                    };
                })],
                color: box.color,
            };
        });
        rectangles.forEach(box => {
            this.pushBoxStack(box.points, this.getStyleFromRGB(box.color), box.color.alpha);
        });
        this.drawBoxStack(context);
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
module.exports = BoxCanvas;
