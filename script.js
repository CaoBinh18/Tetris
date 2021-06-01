const GAME_WIDTH = 200;
const GAME_HEIGHT = 460;
const NUM_ROWS = 20;
const NUM_COLS = 10;
const _ = null;
const x = 'x';


class Brick {
    constructor(game) {
        this.game = game;
        this.dots = [];
        this.data = [];
        this.col = 0;
        this.row = 0;
        this.createData();
        this.createDots();
    }
    createData() {
        let baseData = [
            [
                [x, x, x, x]
            ],
            [
                [x, x],
                [x, x]
            ],
            [
                [x, x, x],
                [x, _, _]
            ],
            [
                [x, x, x],
                [_, _, x]
            ],
            [
                [x, x, x],
                [_, x, _]
            ],
            [
                [x, x, _],
                [_, x, x]
            ],
            [
                [_, x, x],
                [x, x, _]
            ]
        ];
        let r = Math.floor(Math.random() * 6);
        this.data = baseData[r];
    }

    canMoveRight() {
        let thisBrickCanMoveRight = true;
        this.dots.forEach(dot => {
            if (!dot.canMoveRight()) {
                thisBrickCanMoveRight = false;
            }
        });
        return thisBrickCanMoveRight;
    }
    moveRight() {
        if (this.canMoveRight()) {
            this.row++;
            this.dots.forEach(dot => {
                dot.moveRight();
            });
        }
    }

    canMoveLeft() {
        let thisBrickCanMoveLeft = true;
        this.dots.forEach(dot => {
            if (!dot.canMoveLeft()) {
                thisBrickCanMoveLeft = false;
            }
        });
        return thisBrickCanMoveLeft;
    }
    moveLeft() {
        if (this.canMoveLeft()) {
            this.row--;
            this.dots.forEach(dot => {
                dot.moveLeft();
            });
        }
    }
    canFall() {
        let thisBrickCanFall = true;
        this.dots.forEach(dot => {
            if (!dot.canFall()) {
                thisBrickCanFall = false;
            }
        });
        return thisBrickCanFall;
    }
    fall() {
        if (this.canFall()) {
            this.row++;
            this.dots.forEach(dot => {
                dot.fall();
            });
        } else {
            this.game.createNewBrick();
            this.appendToBoard();
            this.game.board.fullRow();
        }
    }
    moveDown() {
        while (this.canFall()) {
            this.fall();
        }
    }
    rotate() {
        let newData = [];
        for (let col = 0; col < this.data[0].length; col++) {
            let newRow = []
            for (let row = this.data.length - 1; row >= 0; row--) {
                newRow.push(this.data[row][col]);
            }
            newData.push(newRow);
        }
        this.data = newData;
        this.createDots();
        console.table(newData);
    }

    appendToBoard() {
        this.dots.forEach(dot => {
            this.game.board.data[dot.row][dot.col] = x;
        });
    }
    createDots() {
        this.dots = [];
        for (let row = 0; row < this.data.length; row++) {
            for (let col = 0; col < this.data[0].length; col++) {
                if (this.data[row][col] == x) {
                    let newDot = new Dot(this.game, row + this.row, col + this.col);
                    this.dots.push(newDot);
                }
            }
        }
    }
    draw() {
        this.dots.forEach(dot => dot.draw());
    }
}
class Board {
    constructor(game) {
        this.game = game;
        this.data = [
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _],
            [_, _, _, _, _, _, _, _, _, _]
        ];
    }

    isEmptyCell(row, col) {
        return this.data[row][col] == _;
    }

    isRowFull(row) {
        let full = true;
        for (let col = 0; col < NUM_ROWS; col++) {
            if (this.isEmptyCell(row, col)) {
                full = false;
            }
        }
        return full;
    }
    fullRow() {
        for (let row = NUM_ROWS; row >= 0; row--) {
          if (this.isRowFull(row)) {
              this.removeRow(row);
          }
        }
    }
    removeRow() {
         this.data.splice(row, 1);
         this.data.unshift([_, _, _, _, _, _, _, _, _, _]);
    }
    createDots() {
        let dots = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                if (this.data[row][col] == x) {
                    let newDot = new Dot(this.game, row, col);
                    dots.push(newDot);
                }
            }
        }
    }
    draw() {
        let dots = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                if (this.data[row][col] == x) {
                    let newDot = new Dot(this.game, row, col);
                    dots.push(newDot);
                }
            }
        }
        dots.forEach(dot => dot.draw());
    }
}

class Dot {
    constructor(game, row, col) {
        this.game = game;
        this.size = 20;
        this.row = row;
        this.col = col;
    }
    hitLeft() {
        return this.col == 0;
    }
    canMoveLeft() {
        if (this.hitLeft()) {
            return false;
        }
        if (!this.game.board.isEmptyCell(this.row, this.col - 1)) { // check vị trí có thể rơi nữa k
            return false;
        }
        return true;
    }
    moveLeft() {
        if (this.canMoveLeft()) {
            this.col--;
        }
    }

    hitRight() {
        return this.col == NUM_COLS - 1;
    }
    canMoveRight() {
        if (this.hitRight()) {
            return false;
        }
        if (!this.game.board.isEmptyCell(this.row, this.col + 1)) {
            return false;
        }
        return true;
    }
    moveRight() {
        if (this.canMoveRight()) {
            this.col++;
        }
    }

    hitBottom() {
        return this.row == NUM_ROWS - 1;
    }

    canFall() {
        if (this.hitBottom()) {
            return false;
        }
        if (!this.game.board.isEmptyCell(this.row + 1, this.col)) { // check vị trí có thể rơi nữa k
            return false;
        }
        return true;
    }

    fall() {
        if (this.canFall()) {
            this.row++;
        }
    }

    update() {

    }

    draw() {
        let x = this.col * this.size;
        let y = this.row * this.size;
        this.game.ctx.fillStyle = 'black';
        this.game.ctx.fillRect(x + 1, y + 1, this.size - 2, this.size - 2);
    }
}

class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
        document.body.appendChild(this.canvas);
        this.board = new Board(this);
        this.keyBoard();
        this.brick = new Brick(this);
        this.startGame();
        this.loop();
    }
    startGame() {
        setInterval(() => {
            this.brick.fall();
        }, 1000);
    }
    createNewBrick() {
        this.brick = new Brick(this);
    }
    keyBoard() {
        document.addEventListener('keydown', (event) => {
            console.log(event.code);
            switch (event.code) {
                case 'ArrowLeft': this.brick.moveLeft(); break;
                case 'ArrowRight': this.brick.moveRight(); break;
                case 'ArrowUp': this.brick.rotate(); break;
                case 'ArrowDown': this.brick.moveDown(); break;
            }
        });
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 30);

    }

    update() {

    }
    clearScreen() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    draw() {
        this.clearScreen();
        this.board.draw();
        this.brick.draw();
    }
}

let g = new Game();