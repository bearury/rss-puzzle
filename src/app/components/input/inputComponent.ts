import ElementCreator, { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import styles from './inputComponent.module.scss';

export type Title = 'name' | 'surname';

class InputComponent extends View {
    constructor(placeholder: string, title: Title, handlerInput: Function) {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.field],
        };
        super(params);

        this.configureView(placeholder, title, handlerInput);
    }

    configureView(placeholder: string, title: Title, handlerInput: Function) {
        const field = this.elementCreator.getElement();

        const titleUpper = title.charAt(0).toUpperCase() + title.slice(1);

        const label = new ElementCreator({
            tag: 'label',
            classNames: [styles.title],
            textContent: titleUpper,
        });
        const input = new ElementCreator({
            tag: 'input',
            classNames: [styles.input],
            callback: [{ event: 'input', callback: (e: InputEvent) => handlerInput(e) }],
            attribute: [
                { id: 'id', value: title },
                { id: 'type', value: 'text' },
                { id: 'placeholder', value: placeholder },
            ],
        });

        const errorText = new ElementCreator({
            tag: 'div',
            classNames: [styles.txt],
            textContent: `Field ${titleUpper} should begin with a capital letter, contain English letters or dash, at least ${
                title === 'name' ? 3 : 4
            } characters long`,
        });

        field.append(label.getElement(), input.getElement(), errorText.getElement());

        return field;
    }

    createError() {
        const field = this.elementCreator.getElement();
        field.classList.add(styles.error);
    }

    clearError() {
        const field = this.elementCreator.getElement();
        field.classList.remove(styles.error);
    }
}

export default InputComponent;
