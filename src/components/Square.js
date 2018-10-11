import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
    constructor() {
        super();
    }

    getPositioning() {
        let top = Math.floor(this.props.model.index / 4) * 150;
        let left = Math.floor(this.props.model.index % 4) * 150;
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