import State from '../../services/state.service';
import ElementCreator, { IElementParams } from '../../utils/element-creator';
import GetJson, { getDataType } from '../../utils/getJson';
import View from '../../utils/view';
import ButtonComponent from '../button/buttonComponent';
import styles from './gameComponent.module.scss';
import GameField from './gameField/gameField';

export interface ButtonStatus {
    status: 'continue' | 'check';
    isDisabled: boolean;
}

export default class GameComponent extends View {
    private static instance: GameComponent;
    private static exists: boolean;
    buttonCheckOrContinue: ButtonComponent | null;
    buttonComplete: ButtonComponent | null;
    gameField: GameField | null;
    statusButton: 'check' | 'continue';
    handlerUpdate: () => void;
    constructor(handlerUpdate: () => void) {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.game],
        };
        super(params);

        this.buttonComplete = null;
        this.buttonCheckOrContinue = null;
        this.gameField = null;
        this.configureView();
        this.statusButton = 'check';
        this.handlerUpdate = handlerUpdate;

        // ======== > singleton < ======== //
        if (GameComponent.exists) {
            return GameComponent.instance;
        }
        GameComponent.instance = this;
        GameComponent.exists = true;
        // ======== > singleton < ======== //
    }

    configureView() {
        new GetJson().getData(getDataType.level1).then((data) => {
            State.DATA = data;

            State.CURRENT_LEVEL_DATA = {
                levelData: State.DATA.rounds[0].levelData,
                words: State.DATA.rounds[0].words,
            };
            const wrapperButtons = new ElementCreator({ tag: 'div', classNames: [styles.wrapperButton] }).getElement();
            this.buttonCheckOrContinue = new ButtonComponent(
                'check',
                'button',
                this.handleClickButtonCheckOrContinue.bind(this),
            );
            this.buttonComplete = new ButtonComponent(
                'Complete the sentence',
                'button',
                this.handleClickButtonComplete.bind(this),
            );
            this.gameField = new GameField(this.handleCheckEndLine.bind(this));

            wrapperButtons.append(this.buttonComplete.getHtmlElement(), this.buttonCheckOrContinue.getHtmlElement());
            const game = this.elementCreator.getElement();
            this.buttonCheckOrContinue?.disabled();

            if (this.gameField instanceof GameField) {
                game.append(this.gameField.getHtmlElement(), wrapperButtons);
            }
        });
    }

    handleClickButtonComplete() {
        this.statusButton = 'continue';
        this.gameField?.automaticSentenceCompletion();
    }

    handleClickButtonCheckOrContinue() {
        if (this.statusButton === 'check') {
            this.gameField?.checkCorrectPieces();
        } else if (State.CURRENT_LEVEL_DATA.words.length === State.CURRENT_ROW) {
            this.gameField?.setNextLevelGame();
            this.buttonCheckOrContinue?.disabled();
        } else {
            State.CURRENT_ROW += 1;
            this.gameField?.initialNextPieces();
            this.buttonCheckOrContinue?.disabled();
        }
    }

    handleCheckEndLine(status: ButtonStatus) {
        this.statusButton = status.status;
        if (!status.isDisabled && this.buttonCheckOrContinue instanceof ButtonComponent) {
            this.buttonCheckOrContinue.getHtmlElement().textContent = status.status;
            this.buttonCheckOrContinue.undisable();
        } else if (status.isDisabled && this.buttonCheckOrContinue instanceof ButtonComponent) {
            this.buttonCheckOrContinue.getHtmlElement().textContent = status.status;
            this.buttonCheckOrContinue.disabled();
        }
    }

    handleCheckEndLevel(status: boolean) {
        console.log('🚩:', status);
    }

    updateGameField() {
        this.handlerUpdate();
        // this.gameField?.updateCanvas();
    }
}
