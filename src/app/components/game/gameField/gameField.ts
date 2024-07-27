import State, { PieceInterface } from '../../../services/state.service';
import ElementCreator, { IElementParams } from '../../../utils/element-creator';
import GetJson from '../../../utils/getJson';
import { randomIndex } from '../../../utils/random';
import View from '../../../utils/view';
import { ButtonStatus } from '../gameComponent';
import styles from './gameField.module.scss';
import Piece from './piece/Piece';

export default class GameField extends View {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    img: HTMLImageElement;
    getJson: GetJson;
    handleCheckEndLine: (status: ButtonStatus) => void;

    constructor(handleCheckEndLine: (status: ButtonStatus) => void) {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.gameField],
        };
        super(params);
        this.canvas = new ElementCreator({
            tag: 'canvas',
            classNames: [styles.canvas],
        }).getElement() as HTMLCanvasElement;
        this.getJson = new GetJson();
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.img = new ElementCreator({ tag: 'img' }).getElement() as HTMLImageElement;
        this.handleCheckEndLine = handleCheckEndLine;
        this.configureView();
    }

    private configureView() {
        const field = this.elementCreator.getElement();
        field.append(this.canvas);
        this.setDataGame();
    }

    private setDataGame() {
        State.CURRENT_LEVEL_DATA = {
            levelData: State.DATA.rounds[State.CURRENT_LEVEL].levelData,
            words: State.DATA.rounds[State.CURRENT_LEVEL].words,
        };

        console.log('🔥:', State.CURRENT_LEVEL_DATA);

        State.SIZE.rows = State.CURRENT_LEVEL_DATA.words.length;
        this.initialWord();

        this.img.src = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${State.CURRENT_LEVEL_DATA.levelData.imageSrc}`;

        this.img.addEventListener('load', () => {
            this.setSize();
            this.initializePieces();
            this.randomizePieces();
            this.updateCanvas();
        });

        this.setAddEventListener();
    }

    private initializePieces() {
        const arrWords = State.WORDS.base.split(' ');

        State.PIECES = Array.from({ length: State.SIZE.rows }, () => []);

        arrWords.forEach((word, i) => {
            const piece = new Piece(this.img, word, State.WORDS.lengthWithoutSpaces, i);
            const pieceFooter = new Piece(this.img, word, State.WORDS.lengthWithoutSpaces, i);
            if (i !== arrWords.length - 1) {
                piece.right = -0.5;
                pieceFooter.right = -0.5;
            }
            if (i !== 0) {
                piece.left = 0.5;
                pieceFooter.left = 0.5;
            }
            State.FOOTER_PIECES.push(pieceFooter);
            State.PIECES[State.CURRENT_ROW - 1].push(false);
        });

        console.log('🌻:123', State.PIECES);
    }

    setNextLevelGame() {
        State.PIECES = [];
        State.FOOTER_PIECES = [];
        State.CURRENT_ROW = 1;
        State.CURRENT_LEVEL += 1;

        State.CURRENT_LEVEL_DATA = {
            levelData: State.DATA.rounds[State.CURRENT_LEVEL].levelData,
            words: State.DATA.rounds[State.CURRENT_LEVEL].words,
        };

        State.SIZE.rows = State.CURRENT_LEVEL_DATA.words.length;
        this.initialWord();

        this.img.src = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${State.CURRENT_LEVEL_DATA.levelData.imageSrc}`;
    }

    initialNextPieces() {
        this.initialWord();
        const arrWords = State.WORDS.base.split(' ');

        arrWords.forEach((word, i) => {
            const piece = new Piece(this.img, word, State.WORDS.lengthWithoutSpaces, i);
            const pieceFooter = new Piece(this.img, word, State.WORDS.lengthWithoutSpaces, i);
            if (i !== arrWords.length - 1) {
                piece.right = -0.5;
                pieceFooter.right = -0.5;
            }
            if (i !== 0) {
                piece.left = 0.5;
                pieceFooter.left = 0.5;
            }
            State.PIECES[State.CURRENT_ROW - 1].push(false);
            State.FOOTER_PIECES.push(pieceFooter);
        });
        this.randomizePieces();
        this.updateCanvas();
        console.log('🌻:', State.PIECES);
    }

    private initialWord() {
        State.WORDS.base = State.CURRENT_LEVEL_DATA.words[State.CURRENT_ROW - 1].textExample;
        State.WORDS.lengthWithoutSpaces = State.WORDS.base.replaceAll(' ', '').length;
        console.log('🔥:', State.WORDS.base);
    }

    public updateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 0.3;
        this.ctx.drawImage(this.img, State.SIZE.x, State.SIZE.y, State.SIZE.width, State.SIZE.height);
        this.ctx.globalAlpha = 1;

        for (let i = 0; i < State.PIECES[State.CURRENT_ROW - 1].length; i += 1) {
            if (State.PIECES[State.CURRENT_ROW - 1][i] instanceof Piece) {
                const PIECE = State.PIECES[State.CURRENT_ROW - 1][i] as PieceInterface;
                PIECE.draw(this.ctx, this.img);
            }
        }

        for (let i = 0; i < State.PIECES.length; i += 1) {
            for (let j = 0; j < State.PIECES[i].length; j += 1) {
                if (State.PIECES[i][j] instanceof Piece) {
                    const PIECE = State.PIECES[i][j] as PieceInterface;
                    PIECE.draw(this.ctx, this.img);
                }
            }
        }

        for (let i = 0; i < State.FOOTER_PIECES.length; i += 1) {
            State.FOOTER_PIECES[i].draw(this.ctx, this.img);
        }

        if (State.STATUS_TRANSLATE) {
            this.setTranslate();
        }
    }

    private setSize() {
        const gameField = this.elementCreator.getElement();

        this.canvas.width = gameField.offsetWidth;
        this.canvas.height = window.innerHeight - 200;

        State.RESIZE = 0.8 * Math.min(gameField.offsetWidth / this.img.width, gameField.offsetHeight / this.img.height);

        State.SIZE.width = Math.floor(State.RESIZE * this.img.width);
        State.SIZE.height = Math.floor(State.RESIZE * this.img.height);

        State.SIZE.x = gameField.offsetWidth / 2 - State.SIZE.width / 2;
        State.SIZE.y = 10;
    }

    private randomizePieces() {
        const arrIndex = randomIndex(State.WORDS.base.split(' ').length);

        let posX = 0;
        arrIndex.forEach((i, index) => {
            State.FOOTER_PIECES[i].id = index;
            State.FOOTER_PIECES[i].xRandom = posX + State.SIZE.x - 10 * arrIndex.length;
            State.FOOTER_PIECES[i].x = posX + State.SIZE.x - 10 * arrIndex.length;
            State.FOOTER_PIECES[i].yRandom = State.SIZE.height + 40;
            State.FOOTER_PIECES[i].y = State.SIZE.height + 40;
            posX += State.FOOTER_PIECES[i].width + 20;
        });
    }

    private setAddEventListener() {
        this.canvas.addEventListener('click', (e) => this.handlerClick(e));
    }

    private handlerClick(e: MouseEvent) {
        const heightPiece = State.SIZE.height / State.SIZE.rows;

        const lower = heightPiece * State.CURRENT_ROW;
        const upper = heightPiece * (State.CURRENT_ROW === 0 ? 1 : State.CURRENT_ROW - 1);

        State.PIECES[State.CURRENT_ROW - 1].forEach((piece, i) => {
            const PIECE = piece as PieceInterface;
            if (
                piece instanceof Piece &&
                e.offsetY > PIECE.y &&
                e.offsetY < PIECE.y + heightPiece &&
                e.offsetX > PIECE.x &&
                e.offsetX < PIECE.x + PIECE.width
            ) {
                if (e.offsetY - 10 < lower && e.offsetY - 10 > upper) {
                    // click current row
                    State.PIECES[State.CURRENT_ROW - 1][i] = false;
                    State.FOOTER_PIECES.push(PIECE);
                    PIECE.x = PIECE.xRandom;
                    PIECE.y = PIECE.yRandom;
                }
            }
        });

        State.FOOTER_PIECES.forEach((piece, i) => {
            if (
                piece instanceof Piece &&
                e.offsetY > piece.y &&
                e.offsetY < piece.y + heightPiece &&
                e.offsetX > piece.x &&
                e.offsetX < piece.x + piece.width
            ) {
                piece.x = this.getSpeaking(State.PIECES[State.CURRENT_ROW - 1]) + State.SIZE.x;
                piece.y = piece.yCorrect;
                State.FOOTER_PIECES.splice(i, 1);

                let p = 0;
                while (p < State.PIECES[State.CURRENT_ROW - 1].length) {
                    if (State.PIECES[State.CURRENT_ROW - 1][p] === false) {
                        State.PIECES[State.CURRENT_ROW - 1][p] = piece;
                        break;
                    }
                    p += 1;
                }

                let speakingNew = 0;
                let m = 0;
                while (m < State.PIECES[State.CURRENT_ROW - 1].length) {
                    if (State.PIECES[State.CURRENT_ROW - 1][m] === false) {
                        break;
                    } else if (piece instanceof Piece) {
                        const PIECES = State.PIECES[State.CURRENT_ROW - 1] as PieceInterface[];
                        PIECES[m].x = speakingNew + State.SIZE.x;
                        speakingNew += PIECES[m].width;
                        m += 1;
                    }
                }
            }
        });
        this.updateCanvas();
        this.checkStatusLine();
    }

    private getSpeaking(arr: (PieceInterface | boolean)[]) {
        const res: PieceInterface[] = [];

        let k = 0;
        while (k < arr.length) {
            if (arr[k] !== false) {
                res.push(arr[k] as Piece);
            } else {
                break;
            }
            k += 1;
        }

        return res.reduce((accumulator, entry) => {
            const PIECE = entry as PieceInterface;
            if (PIECE instanceof Piece) {
                accumulator += PIECE.width;
            }
            return accumulator;
        }, 0);
    }

    private checkStatusLine() {
        if (this.checkEndLine({ isCorrect: true })) {
            this.handleCheckEndLine({ isDisabled: false, status: 'continue' });
        } else if (this.checkEndLine({ isCorrect: false })) {
            this.handleCheckEndLine({ isDisabled: false, status: 'check' });
        } else {
            this.handleCheckEndLine({ isDisabled: true, status: 'check' });
        }
    }

    checkCorrectPieces() {
        State.PIECES[State.CURRENT_ROW - 1].forEach((piece) => {
            if (piece instanceof Piece) {
                if (piece.x === piece.xCorrect) {
                    piece.draw(this.ctx, this.img, true);
                }
            }
        });
    }

    private checkEndLine({ isCorrect = true }): boolean {
        let countCorrect: PieceInterface[] = [];
        if (!State.PIECES[State.CURRENT_ROW - 1].includes(false)) {
            countCorrect = State.PIECES[State.CURRENT_ROW - 1].filter((piece) => {
                const PIECE = piece as PieceInterface;
                return isCorrect ? PIECE.x === PIECE.xCorrect : PIECE.word;
            }) as PieceInterface[];
        }
        return countCorrect.length === State.PIECES[State.CURRENT_ROW - 1].length;
    }

    setTranslate() {
        const word = State.CURRENT_LEVEL_DATA.words[State.CURRENT_ROW - 1].textExampleTranslate;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#fff000';
        this.ctx.fillText(word, State.SIZE.x + 30, State.SIZE.height + 30);
    }

    automaticSentenceCompletion() {
        State.PIECES[State.CURRENT_ROW - 1] = [...State.PIECES[State.CURRENT_ROW - 1], ...State.FOOTER_PIECES].filter(
            (p) => p !== false,
        );

        State.PIECES[State.CURRENT_ROW - 1].forEach((piece) => {
            const PIECE = piece as PieceInterface;
            PIECE.x = PIECE.xCorrect;
            PIECE.y = PIECE.yCorrect;
        });

        State.FOOTER_PIECES = [];

        console.log('🔥:', State.PIECES, State.FOOTER_PIECES);

        this.updateCanvas();
        this.checkStatusLine();
    }
}
