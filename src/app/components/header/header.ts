import styles from './header.module.scss';
import ButtonComponent from '../button/buttonComponent';
import ElementCreator, { IElementParams } from '../../utils/element-creator';
import View from '../../utils/view';
import { localStorageService } from '../../services/local-storage.service';
import UserName from './user-name/userName';
import { IUser } from '../../entity/user';
import { PageWrapperComponent } from '../../page';
import State from '../../services/state.service';
import CheckboxComponent from '../checkbox/checkboxComponent';
import SoundComponent from '../sound/soundComponent';

export default class Header extends View {
    handler: () => void;
    constructor(handlerUpdate: () => void) {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.header],
        };
        super(params);

        this.configureView();
        this.handler = handlerUpdate;
    }

    configureView() {
        const button = new ButtonComponent('Logout', 'button', this.handlerLogout);

        const header = this.elementCreator.getElement();

        if (this.getUser()) {
            const userName = new UserName(this.getUser() as IUser);
            header.append(userName.getHtmlElement());
        }

        const settings = new ElementCreator({ tag: 'div', classNames: [styles.settings] }).getElement();
        const sound = new SoundComponent();
        const checkbox = new CheckboxComponent('translate', this.handleInputCheckbox.bind(this), [styles.checkbox]);
        settings.append(checkbox.getHtmlElement(), sound.getHtmlElement());

        header.append(settings, button.getHtmlElement());
    }

    handlerLogout() {
        localStorageService.saveData('user', null);
        new PageWrapperComponent().rerender();
    }

    getUser(): IUser | null {
        return localStorageService.getData('user') || null;
    }

    handleInputCheckbox(e: InputEvent) {
        const target = e.target as HTMLInputElement;
        State.STATUS_TRANSLATE = target.checked;
        this.handler();
    }
}
