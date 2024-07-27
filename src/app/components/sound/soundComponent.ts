import ElementCreator, { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import styles from './soundComponent.module.scss';
import soundOnIcon from '../../../../public/sound-on.svg';
import soundBusyIcon from '../../../../public/sound-busy.svg';
import State from '../../services/state.service';

export default class SoundComponent extends View {
    img: ElementCreator;
    sound: HTMLAudioElement | null;
    constructor() {
        const params: IElementParams = {
            tag: 'button',
            classNames: [styles.sound],
        };
        super(params);
        this.img = new ElementCreator({
            tag: 'img',
            attribute: [{ id: 'src', value: soundOnIcon }],
            callback: [{ event: 'click', callback: this.handlerClick.bind(this) }],
        });

        this.sound = null;
        this.configureView();
    }

    configureView() {
        const sound = this.elementCreator.getElement();

        sound.append(this.img.getElement());
    }

    handlerClick() {
        if (this.sound === null) {
            this.sound = new Audio(State.baseUrl + State.CURRENT_LEVEL_DATA.words[State.CURRENT_ROW - 1].audioExample);
            this.sound.addEventListener('ended', () => {
                this.endedPlaySound();
            });
        }
        if (!State.SOUND.current_status) {
            this.playSound();
        } else {
            this.sound.currentTime = 0;
            this.sound.pause();
            this.endedPlaySound();
        }

        const soundElement = this.elementCreator.getElement();
        soundElement.classList.toggle(styles.active);
    }

    playSound() {
        if (this.sound instanceof HTMLAudioElement) this.sound.play();
        State.SOUND.current_status = true;
        this.img.getElement().setAttribute('src', soundBusyIcon);
    }

    endedPlaySound() {
        State.SOUND.current_status = false;
        this.img.getElement().setAttribute('src', soundOnIcon);
        this.sound = null;
    }
}
