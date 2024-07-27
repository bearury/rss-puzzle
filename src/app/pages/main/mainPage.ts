import GameComponent from '../../components/game/gameComponent';
import Header from '../../components/header/header';
import StartScreenComponent from '../../components/start-screen/startScreenComponent';
import { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import styles from './mainPage.module.scss';

export default class MainPageComponent extends View {
    header: Header | null;
    constructor() {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.mainPage],
        };
        super(params);
        this.configureView();
        this.header = null;
    }

    configureView() {
        const main = this.elementCreator.getElement();
        const startScreen = new StartScreenComponent(this.handlerClick.bind(this));

        this.header = new Header(this.handlerUpdate);
        main.append(this.header.getHtmlElement(), startScreen.getHtmlElement());
        // const game = new GameComponent(this.handlerUpdate);
        // this.header = new Header(this.handlerUpdate);
        // main.append(this.header?.getHtmlElement() as HTMLElement, game.getHtmlElement());
    }

    handlerClick() {
        const main = this.elementCreator.getElement();
        main.replaceChildren();
        this.header = new Header(this.handlerUpdate);
        const game = new GameComponent(this.handlerUpdate);
        main.append(this.header?.getHtmlElement() as HTMLElement, game.getHtmlElement());
    }

    handlerUpdate() {
        console.log('🍄:');
    }
}
