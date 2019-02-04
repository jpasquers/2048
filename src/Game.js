const Observable = require("rxjs");
let id = 0;


class Square {
    constructor(index, value) {
        this.id = id++;
        this.index = index;
        this.value = value;
        this.toDelete = false;
    }
}

export class Game {

    constructor(visualDelay) {
        if (visualDelay) this.visualDelay = visualDelay;
        else visualDelay = 0;
        this.squares = [];
        this.gameOver = false;
    }

    run() {
        this.observable = new Observable.Observable(observer => {
            this.createSquares();
            observer.next({
                gameState: this.squares,
                readyForInput: true
            });
            this.updateListeners = (data) => {
                if (this.gameOver) {
                    observer.complete();
                }
                observer.next(data);
            }
        })
        return this.observable;
    }

    checkGameOver() {
        if (this.squares.length != 16) return false;

        let boardCopy = [...this.squares];

        //this way, the model at index i will be at index i on the board.
        boardCopy.sort((a,b) => a.index - b.index);
        
        let gameOver = true;
        //horizontal check
        for (let i=0; i<16; i+=4) {
            for (let j=i+1; j<i+4; j++) {
                if (boardCopy[j].value == boardCopy[j-1].value) {
                    gameOver = false;
                }
            }
        }

        //vertical check
        for (let i=0; i<4; i++) {
            for (let j=i+4; j<16; j+=4) {
                if (boardCopy[j].value == boardCopy[j-4].value) {
                    gameOver = false;
                } 
            }
        }
        return gameOver;
    }

    handlePress(direction) {
        if (direction == "left") this.leftPress();
        else if (direction == "up") this.upPress();
        else if (direction == "right") this.rightPress();
        else if (direction == "down") this.downPress();

        this.squares = this.squares.filter(square => !square.toDelete);
        if (this.updateListeners) this.updateListeners({
            gameState: this.squares,
            readyForInput: false
        });
        this.createSquares();
        console.log(this.squares);
        this.gameOver = this.checkGameOver();
        if (this.updateListeners) {
            setTimeout(() => {
                this.updateListeners({
                    gameState: this.squares,
                    readyForInput: true
                });
            }, this.visualDelay);
        }
    }

    createSquare() {
        let index = this.getRandomOpenIndex();
        let value = Math.random() >= 0.9 ? 4 : 2;
        return new Square(index,value);
    }

    createSquares() {
        if (this.squares.length < 16) this.squares.push(this.createSquare());
        if (this.squares.length < 16) this.squares.push(this.createSquare());
    }

    getRandomOpenIndex() {
        let possibleIndices = [...Array(16).keys()];
        this.squares.forEach((square) => {
            possibleIndices = possibleIndices.filter(index => index != square.index);
        })
        return possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
    }

    leftPress() {
        for (let i=0; i<16; i+=4) {
            //i will be the index of the first item in the row we're examining atm
            //Grab all items in that row
            let squaresInThisRow = this.squares.filter(square => square.index >= i && square.index < i+4);
            //Always sort squares such that the first item is the farthes in the direction we're moving
            //For left presses, the smaller columns go first.
            let sortedSquares = squaresInThisRow.sort((a,b) => a.index - b.index);
            //"Free indices" are the indices our squares want to be, highest priority first.
            let freeIndices = [i,i+1,i+2,i+3];
            this.press(sortedSquares, freeIndices);
        }
    }

    upPress() {
        //See leftPress for process documentation, this is effectively the same.
        for (let i=0; i<4; i++) {
            //i is first item in column we're looking at.
            //Grab all items in that column.
            let squaresInThisColumn = this.squares.filter(square => square.index % 4 == i);
            let sortedSquares = squaresInThisColumn.sort((a,b) => a.index - b.index);
            let freeIndices = [i,i+4,i+8,i+12];
            this.press(sortedSquares, freeIndices);
        }
    }

    rightPress() {
        //See leftPress for process documentation, this is effectively the same.
        for (let i=15; i>=3; i-=4) {
            let squaresInThisRow = this.squares.filter(square => square.index <= i && square.index > i-4);
            let sortedSquares = squaresInThisRow.sort((a,b) => b.index - a.index);
            let freeIndices = [i,i-1,i-2,i-3];
            this.press(sortedSquares, freeIndices);
        }
    }

    downPress() {
        //See leftPress for process documentation, this is effectively the same.
        for (let i=15; i>=12; i-=1) {
            let squaresInThisColumn = this.squares.filter(square => i % 4 == square.index % 4);
            let sortedSquares = squaresInThisColumn.sort((a,b) => b.index - a.index);
            let freeIndices = [i,i-4,i-8,i-12];
            this.press(sortedSquares,freeIndices);
        }
    }

    press(sortedSquares, freeIndices) {
        sortedSquares.forEach((square,index) => {
            if (index != 0) {
                let previousSquare = sortedSquares[index-1];
                if (square && !previousSquare.toDelete && square.value == previousSquare.value) {
                    square.toDelete = true;
                    previousSquare.value*=2;
                }
            }
            if (!square.toDelete) {
                square.index = freeIndices.shift();
            }
        })
    }
}