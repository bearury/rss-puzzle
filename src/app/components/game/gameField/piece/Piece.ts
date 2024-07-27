import State from '../../../../services/state.service';

export default class Piece {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    word: string;
    xCorrect: number;
    yCorrect: number;
    xRandom: number;
    yRandom: number;
    right: number | null;
    left: number | null;
    leftPart: number;
    topPart: number;
    widthPart: number;
    heightPart: number;
    constructor(img: HTMLImageElement, word: string, allWordLength: number, id: number) {
        this.id = id;
        this.word = word;

        this.width = (State.SIZE.width * ((word.length * 100) / allWordLength)) / 100;
        this.height = State.SIZE.height / State.SIZE.rows;

        this.x = State.SIZE.x + this.getSpeaking();
        this.y = State.SIZE.y + (State.SIZE.height * (State.CURRENT_ROW - 1)) / State.SIZE.rows;

        this.xCorrect = this.x;
        this.yCorrect = this.y;
        this.xRandom = this.x;
        this.yRandom = this.y;

        this.right = null;
        this.left = null;

        // image clip
        this.leftPart = this.getSpeakingImg(id);
        this.topPart = ((State.CURRENT_ROW - 1) * img.height) / State.SIZE.rows;
        this.widthPart = this.width / State.RESIZE;
        this.heightPart = img.height / State.SIZE.rows;
    }

    draw(context: CanvasRenderingContext2D, img: HTMLImageElement, isCorrect = false) {
        context.beginPath();

        const sz = Math.min(100, 50);
        const neck = 0.05 * sz;
        const tabWidth = 0.2 * sz;
        const tabHeight = 0.2 * sz;

        context.strokeStyle = '#fff';

        if (isCorrect) {
            context.lineWidth = 3;
            context.strokeStyle = '#69ef08';
        } else {
            context.lineWidth = 1;
        }

        // from top left
        context.moveTo(this.x, this.y);
        // to top right
        context.lineTo(this.x + this.width, this.y);
        // to bottom right
        if (this.right) {
            context.lineTo(this.x + this.width, this.y + this.height * Math.abs(this.right) - neck);

            context.bezierCurveTo(
                this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
                this.y + this.height * Math.abs(this.right) - neck,

                this.x + this.width - tabHeight * Math.sign(this.right),
                this.y + this.height * Math.abs(this.right) - tabWidth,

                this.x + this.width - tabHeight * Math.sign(this.right),
                this.y + this.height * Math.abs(this.right),
            );

            context.bezierCurveTo(
                this.x + this.width - tabHeight * Math.sign(this.right),
                this.y + this.height * Math.abs(this.right) + tabWidth,

                this.x + this.width - tabHeight * Math.sign(this.right) * 0.2,
                this.y + this.height * Math.abs(this.right) + neck,

                this.x + this.width,
                this.y + this.height * Math.abs(this.right) + neck,
            );

            context.lineTo(this.x + this.width, this.y + this.height);
        }

        context.lineTo(this.x + this.width, this.y + this.height);
        // to bottom left
        context.lineTo(this.x, this.y + this.height);
        // to top left
        if (this.left) {
            context.lineTo(this.x, this.y + this.height * Math.abs(this.left) + neck);

            context.bezierCurveTo(
                this.x + tabHeight * Math.sign(this.left) * 0.2,
                this.y + this.height * Math.abs(this.left) + neck,

                this.x + tabHeight * Math.sign(this.left),
                this.y + this.height * Math.abs(this.left) + tabWidth,

                this.x + tabHeight * Math.sign(this.left),
                this.y + this.height * Math.abs(this.left),
            );

            context.bezierCurveTo(
                this.x + tabHeight * Math.sign(this.left),
                this.y + this.height * Math.abs(this.left) - tabWidth,

                this.x + tabHeight * Math.sign(this.left) * 0.2,
                this.y + this.height * Math.abs(this.left) - neck,

                this.x,
                this.y + this.height * Math.abs(this.left) - neck,
            );
            context.lineTo(this.x, this.y + this.height * Math.abs(this.left) - neck);
        }
        context.lineTo(this.x, this.y);

        context.save();
        context.clip();

        const scaledTabHeight =
            (Math.min(img.width / State.WORDS.base.split(' ').length, img.height / State.SIZE.rows) * tabHeight) / sz;

        context.drawImage(
            img,
            this.leftPart - scaledTabHeight,
            this.topPart,
            this.widthPart + scaledTabHeight * 2,
            this.heightPart,
            this.x - tabHeight,
            this.y,
            this.width + tabHeight * 2,
            this.height,
        );

        context.restore();
        context.stroke();

        this.drawText(context);
    }

    isClose() {
        if (this.distance({ x: this.x, y: this.y }, { x: this.xCorrect, y: this.yCorrect }) < this.width / 3) {
            return true;
        }
        return false;
    }

    snap() {
        this.x = this.xCorrect;
        this.y = this.yCorrect;
    }

    distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }

    getSpeaking(): number {
        const res = State.FOOTER_PIECES.reduce((acc: number, el) => {
            const piece = el as Piece;
            acc += piece.width;
            return acc;
        }, 0);

        return res as number;
    }

    getSpeakingImg(index: number) {
        let res = 0;
        Array.from({ length: index }).forEach((_, i) => {
            const footerPiece = State.FOOTER_PIECES[i] as Piece;
            res += footerPiece.width;
        });
        return res / State.RESIZE;
    }

    drawText(context: CanvasRenderingContext2D) {
        context.font = 'bold 16px Arial';
        context.fillStyle = '#ffffff';
        const halfText = this.word.length * 3 + this.word.length / 3;
        context.fillText(this.word, this.x + this.width / 2 - halfText, this.y + this.height / 2 + 4);
    }
}
