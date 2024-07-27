import Piece from '../components/game/gameField/piece/Piece';

export default class State {
    static SIZE: { x: number; y: number; width: number; height: number; rows: number } = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rows: 0,
    };
    static WORDS: { base: string; lengthWithoutSpaces: number } = {
        base: '',
        lengthWithoutSpaces: 0,
    };
    static baseUrl = 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/';
    static CURRENT_ROW: number = 1;
    static CURRENT_LEVEL: number = 0;
    static CURRENT_LEVEL_DATA: Round;
    static DATA: Data;
    static PIECES: (PieceInterface | boolean)[][] = [[]];
    static FOOTER_PIECES: PieceInterface[] = [];
    static RESIZE: number = 0;
    static STATUS_TRANSLATE: boolean = false;
    static SOUND: { current_status: boolean; level_status: boolean } = { current_status: false, level_status: false };
}

export interface Data {
    rounds: Round[];
    roundsCount: number;
}

export interface Round {
    levelData: {
        id: string;
        imageSrc: string;
    };
    words: Word[];
}

export interface Word {
    id: number;
    textExample: string;
    textExampleTranslate: string;
    audioExample: string;
}

export interface PieceInterface extends Piece {}

export interface PieceFooterInterface {
    x: number;
    y: number;
    text: string;
}
