import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
    constructor() {
        super();
        let browser_width = window.innerWidth || document.body.clientWidth;
        let browser_height = window.innerHeight || document.body.clientHeight;
        this.browser_dim = Math.min(browser_height,browser_width)
    }

    getPositioning() {
        let top = Math.floor(this.props.model.index / 4) * (this.browser_dim / 4);
        let left = Math.floor(this.props.model.index % 4) * (this.browser_dim / 4);
        return {
            top: top,
            left: left
        }
    }

    render() {
        let style = this.getPositioning();
        let clsName = "square square-" + this.props.model.value;
        return (
            <div className={clsName} style={style}>
                <span className="square-num">{this.props.model.value}</span>
            </div>
        );
    }
}

export default Square;