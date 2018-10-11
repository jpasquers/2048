import React, { Component } from 'react';
import './App.css';
import Square from './components/Square';
import SquareModel from './SquareModel';
import HammerJS from 'hammerjs';

class App extends Component {

    

    constructor() {
        super();

        let browser_width = window.innerWidth || document.body.clientWidth;
        let browser_height = window.innerHeight || document.body.clientHeight;
        this.browser_dim = Math.min(browser_height,browser_width)

        this.state = {
            squareModels: [],
            gameOver: false
        }

        this.window_hammer = new HammerJS.Manager(window);

        this.eventActive = false;

        this.startOver = this.startOver.bind(this);
        
        //Since we are pre-render, do these operations without setState
        let startingSquare1 = this.createNewSquareModel();
        this.state.squareModels.push(startingSquare1);
        let startingSquare2 = this.createNewSquareModel();
        this.state.squareModels.push(startingSquare2);

        this.handleKeyPresses();
    }

    renderSquares() {
        return this.state.squareModels.map((model) => {
            return <Square key={model.id} model={model}></Square>
        })
    }

    getRandomOpenIndex() {
        let possibleIndices = [];
        for (let i=0; i<16; i++) {
            let validIndex = true;
            this.state.squareModels.forEach((model) => {
                if (model.index == i) validIndex = false;
            })
            if (validIndex) possibleIndices.push(i);
        }
        return possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
    }

    createNewSquareModel () {
        let index1 = this.getRandomOpenIndex();
        let value1 = Math.random() >= 0.9 ? 4 : 2;
        return new SquareModel(index1,value1);
    }

    createNewSquares() {
        return new Promise((resolve,reject) => {
            //Create two new squares. Each square has a 90% chance of being a '2', and a 10% chance of being a '4'
            if (this.state.squareModels.length < 16) {
                let model1 = this.createNewSquareModel();
                this.setState({squareModels: this.state.squareModels.concat([model1])}, () => {
                    if (this.state.squareModels.length < 16) {
                        let model2 = this.createNewSquareModel();
                        this.setState({squareModels: this.state.squareModels.concat([model2])}, () => {
                            resolve();
                        });
                    }
                    else {
                        //maybe reject
                        resolve();
                    }
                })
            }
            else {
                //maybe reject
                resolve();
            }
        })
    }

    checkGameOver() {
        if (this.state.squareModels.length != 16) return false;

        let models = [...this.state.squareModels];

        //this way, the model at index i will be at index i on the board.
        models.sort((a,b) => a.index - b.index);
        
        console.log(models);
        let gameOver = true;
        //horizontal check
        for (let i=0; i<16; i+=4) {
            for (let j=i+1; j<i+4; j++) {
                if (models[j].value == models[j-1].value) {
                    console.log(j);
                    console.log(models);
                    console.log(models[j].value + " " + models[j-1].value);
                    gameOver = false;
                }
            }
        }

        //vertical check
        for (let i=0; i<4; i++) {
            for (let j=i+4; j<16; j+=4) {
                if (models[j].value == models[j-4].value) {
                    console.log(j);
                    console.log(models[j].value + " " + models[j-4].value);
                    gameOver = false;
                } 
            }
        }
        console.log(gameOver);
        if (gameOver) this.setState({gameOver: true});
    }

    keyPressAfter() {
        this.createNewSquares().then(() => {
            this.checkGameOver();
            this.eventActive = false;
        })
    }

    handleLeftPress() {
        let modelsCopy = [...this.state.squareModels];
        for (let i=0; i<16; i+=4) {
            let nextFreeIndex = i;
            let modelsOnThisRow = modelsCopy.filter((model) => model.index >=i && model.index <i+4);
            modelsOnThisRow.sort((a,b) => a.index - b.index);
            modelsOnThisRow.forEach((model,index) => {
                if (index != 0) {
                    let prevModel = modelsOnThisRow[index-1];
                    if (model && !prevModel.toDelete && model.value == prevModel.value) {
                        model.toDelete = true;
                        prevModel.value*=2;
                    }
                }
                if (!model.toDelete) model.index = nextFreeIndex++;

            })
        }
        modelsCopy = modelsCopy.filter((model) => !model.toDelete);

        this.setState({squareModels: modelsCopy}, () => {    
            setTimeout(() => {
                this.keyPressAfter();
            },100);
        });
    }

    handleUpPress() {
        let modelsCopy = [...this.state.squareModels];
        for (let i=0; i<4; i++) {
            let nextFreeIndex = i;
            let modelsOnThisCol = modelsCopy.filter((model) => model.index % 4 == i);
            modelsOnThisCol.sort((a,b) => a.index - b.index);
            modelsOnThisCol.forEach((model,index) => {
                if (index != 0) {
                    let prevModel = modelsOnThisCol[index-1];
                    if (model && !prevModel.toDelete && model.value == prevModel.value) {
                        model.toDelete = true;
                        prevModel.value*=2;
                    }
                }
                if (!model.toDelete) {
                    model.index = nextFreeIndex;
                    nextFreeIndex+=4;
                }
            })
        }
        modelsCopy = modelsCopy.filter((model) => !model.toDelete);
        this.setState({squareModels: modelsCopy}, () => {    
            setTimeout(() => {
                this.keyPressAfter();
            },100);
        });
    }

    handleRightPress() {
        let modelsCopy = [...this.state.squareModels];
        for (let i=15; i>=3; i-=4) {
            let nextFreeIndex = i;
            let modelsOnThisCol = modelsCopy.filter((model) => model.index <=i && model.index>i-4);
            modelsOnThisCol.sort((a,b) => b.index - a.index);
            modelsOnThisCol.forEach((model,index) => {
                if (index != 0) {
                    let prevModel = modelsOnThisCol[index-1];
                    if (model && !prevModel.toDelete && model.value == prevModel.value) {
                        model.toDelete = true;
                        prevModel.value*=2;
                    }
                }
                if (!model.toDelete) {
                    model.index = nextFreeIndex;
                    nextFreeIndex-=1;
                }
            })
        }
        modelsCopy = modelsCopy.filter((model) => !model.toDelete);
        this.setState({squareModels: modelsCopy}, () => {    
            setTimeout(() => {
                this.keyPressAfter();
            },100);
        });
    }

    handleDownPress() {
        let modelsCopy = [...this.state.squareModels];
        for (let i=15; i>=12; i-=1) {
            let nextFreeIndex = i;
            let modelsOnThisCol = modelsCopy.filter((model) => model.index % 4 == i % 4);
            modelsOnThisCol.sort((a,b) => b.index - a.index);
            modelsOnThisCol.forEach((model,index) => {
                if (index != 0) {
                    let prevModel = modelsOnThisCol[index-1];
                    if (model && !prevModel.toDelete && model.value == prevModel.value) {
                        model.toDelete = true;
                        prevModel.value*=2;
                    }
                }
                if (!model.toDelete) {
                    model.index = nextFreeIndex;
                    nextFreeIndex-=4;
                }
            })
        }
        modelsCopy = modelsCopy.filter((model) => !model.toDelete);
        this.setState({squareModels: modelsCopy}, () => {    
            setTimeout(() => {
                this.keyPressAfter();
            },100);
        });
    }

    handleKeyPresses() {
        document.addEventListener("keydown", (evt) => {
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                let keycode = evt.keyCode;
                if (keycode == 37) this.handleLeftPress();
                else if (keycode == 38) this.handleUpPress();
                else if (keycode == 39) this.handleRightPress();
                else if (keycode == 40) this.handleDownPress();
                else this.eventActive = false;
            }
        }, false);

        this.window_hammer.on("swipeleft", () => {
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.handleLeftPress();
            }
        })
        this.window_hammer.on("swiperight", () => {
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.handleRightPress();
            }
        })
        this.window_hammer.on("swipeup", () => {
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.handleUpPress();
            }
        })
        this.window_hammer.on("swipedown", () => {
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.handleDownPress();
            }
        })
    }

    startOver() {
        this.setState({
            squareModels: [],
            gameOver: false
        }, () => {
            this.createNewSquares();
        })
    }

    renderGameOver() {
        if (this.state.gameOver) {
            return <div className="game-over">GAME OVER. 
                <button onClick={() => {this.startOver()}}>Try again</button>
            </div>
        }
        else {
            return null;
        }
    }

    render() {
        let style = {
            width: this.browser_dim,
            height: this.browser_dim
        }
        return (
            <div>
                {this.renderGameOver()}
                <div style={style} className="background">
                    {this.renderSquares()}
                </div>
            </div>
        );
    }
}

export default App;
