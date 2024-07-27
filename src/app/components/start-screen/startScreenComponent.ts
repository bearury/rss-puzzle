import ElementCreator, { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import ButtonComponent from '../button/buttonComponent';
import styles from './startScreenComponent.module.scss';

export default class StartScreenComponent extends View {
    constructor(cb: () => void) {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.startScreen],
        };
        super(params);

        this.configureView(cb);
    }

    configureView(cb: () => void) {
        const startScreen = this.elementCreator.getElement();
        const button = new ButtonComponent('Start game', 'button', cb);

        const title = new ElementCreator({ tag: 'div', classNames: [styles.title], textContent: 'English puzzle' });
        const content = new ElementCreator({
            tag: 'div',
            classNames: [styles.content],
            textContent: 'Click on words, collect phrases.',
        });
        const content2 = new ElementCreator({
            tag: 'div',
            classNames: [styles.content],
            textContent: 'Words can be drag and drop. Select tooltip in the menu',
        });

        startScreen.append(title.getElement(), content.getElement(), content2.getElement(), button.getHtmlElement());
    }
}
