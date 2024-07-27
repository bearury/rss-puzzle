import { localStorageService } from '../../services/local-storage.service';
import ButtonComponent from '../../components/button/buttonComponent';
import InputComponent from '../../components/input/inputComponent';
import User, { IUser } from '../../entity/user';
import ElementCreator, { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import styles from './authPage.module.scss';
import { PageWrapperComponent } from '../../page';

interface IInputComponent extends InputComponent {}

export default class AuthPageComponent extends View {
    form: ElementCreator | null;
    user: IUser;
    inputName: IInputComponent;
    inputSurname: IInputComponent;
    constructor() {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.auth],
        };
        super(params);
        this.form = null;
        this.inputName = new InputComponent('Input name', 'name', this.handlerInput.bind(this));
        this.inputSurname = new InputComponent('Input surname', 'surname', this.handlerInput.bind(this));

        this.configureView();
        this.user = { name: '', surname: '' };
    }

    configureView() {
        const auth = this.elementCreator.getElement();

        this.form = new ElementCreator({
            tag: 'form',
            classNames: [styles.form],
            children: [
                new ElementCreator({
                    tag: 'div',
                    classNames: [styles.container],
                    children: [
                        new ElementCreator({
                            tag: 'h1',
                            classNames: [styles.title],
                            textContent: 'Authorization',
                        }).getElement(),
                        new ElementCreator({
                            tag: 'div',
                            classNames: [styles.fields],
                            children: [this.inputName.getHtmlElement(), this.inputSurname.getHtmlElement()],
                        }).getElement(),
                        new ButtonComponent('Login', 'submit').getHtmlElement(),
                    ],
                }).getElement(),
            ],
            callback: [{ event: 'submit', callback: (e: SubmitEvent) => this.handlerSubmit(e) }],
        });

        auth.append(this.form?.getElement());
    }

    handlerSubmit(e: SubmitEvent) {
        e.preventDefault();
        const user = new User(this.user);
        if (user.validationName() && user.validationSurname()) {
            localStorageService.saveData('user', user.getUser());
            new PageWrapperComponent().rerender();
        } else if (!user.validationName() && !user.validationSurname()) {
            this.inputName.createError();
            this.inputSurname.createError();
        } else if (!user.validationName()) {
            this.inputName.createError();
        } else if (!user.validationSurname()) {
            this.inputSurname.createError();
        }
    }

    handlerInput(e: InputEvent) {
        this.inputName.clearError();

        const target = e.target as HTMLInputElement;

        if (target.id === 'name') {
            this.inputName.clearError();
            this.user.name = target.value;
        } else if (target.id === 'surname') {
            this.inputSurname.clearError();
            this.user.surname = target.value;
        }
    }
}
