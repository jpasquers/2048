import React, { Component } from 'react';
import './App.css';
import Square from './components/Square';
import HammerJS from 'hammerjs';
import { Game } from './Game';

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
        this.window_hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: this.browser_dim/7 }) );

        this.eventActive = false;

        this.startOver = this.startOver.bind(this);

        this.game = new Game();

    }

    componentDidMount() {
        this.handleKeyPresses();

        this.observable = this.game.run();
        this.observable.subscribe((update) => {
            this.eventActive = !update.readyForInput;
            this.setState({
                squareModels: [...update.gameState]
            });
        }, () => {

        }, () => {
            this.gameOver = true;
        });
    }

    renderSquares() {
        return this.state.squareModels.map((model) => {
            return <Square key={model.id} model={model}></Square>
        })
    }

    handleKeyPresses() {
        document.addEventListener("keydown", (evt) => {
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                let keycode = evt.keyCode;
                if (keycode == 37) this.game.handlePress("left");
                else if (keycode == 38) this.game.handlePress("up");
                else if (keycode == 39) this.game.handlePress("right");
                else if (keycode == 40) this.game.handlePress("down");
                else this.eventActive = false;
            }
        }, false);

        
        document.onmousedown = (ev) => {
            ev.preventDefault();
        };

        document.onmousemove = (ev) => {
            ev.preventDefault();
        };

        this.window_hammer.on("panend", () => {
            this.eventActive = false;
        })

        this.window_hammer.on("panleft", (ev) => {
            ev.preventDefault();
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.game.handlePress("left");
            }
        })
        this.window_hammer.on("panright", (ev) => {
            ev.preventDefault();
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.game.handlePress("right");
            }
        })
        this.window_hammer.on("panup", (ev) => {
            ev.preventDefault();
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.game.handlePress("up");
            }
        })
        this.window_hammer.on("pandown", (ev) => {
            ev.preventDefault();
            if (!this.state.gameOver && !this.eventActive) {
                this.eventActive = true;
                this.game.handlePress("down");
            }
        })
    }

    startOver() {
        this.game = new Game();
        this.setState({
            squareModels: [],
            gameOver: false
        }, () => {
            this.game.run();
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
