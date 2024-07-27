import ElementCreator, { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import styles from './checkboxComponent.module.scss';

export default class CheckboxComponent extends View {
    constructor(id: string, callback: (e: InputEvent) => void, classNames: string[]) {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.wrapper],
        };
        super(params);

        this.configureView(id, callback, classNames);
    }

    configureView(id: string, callback: (e: InputEvent) => void, classNames: string[]) {
        const wrapper = this.elementCreator.getElement();

        const checkboxParams: IElementParams = {
            tag: 'input',
            classNames: [styles.checkbox, ...classNames],
            callback: [{ event: 'input', callback }],
            attribute: [
                { id: 'type', value: 'checkbox' },
                { id: 'id', value: id },
            ],
        };

        const labelParams: IElementParams = {
            tag: 'label',
            classNames: [styles.label],
            attribute: [{ id: 'for', value: id }],
            textContent: 'Translate',
        };

        const checkbox = new ElementCreator(checkboxParams).getElement();
        const label = new ElementCreator(labelParams);

        wrapper.append(checkbox, label.getElement());
    }
}
