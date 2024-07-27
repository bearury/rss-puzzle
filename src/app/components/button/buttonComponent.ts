import { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import styles from './buttonComponent.module.scss';

class ButtonComponent extends View {
    constructor(textContent: string, typeAttribute: string, callback?: () => void) {
        const params: IElementParams = {
            tag: 'button',
            classNames: [styles.btn],
            callback: callback && [{ event: 'click', callback }],
            attribute: [{ id: 'type', value: typeAttribute }],
            textContent,
        };
        super(params);
    }

    disabled() {
        this.elementCreator.getElement().setAttribute('disabled', 'true');
    }

    undisable() {
        this.elementCreator.getElement().removeAttribute('disabled');
    }
}

export default ButtonComponent;
