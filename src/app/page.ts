import { IElementParams } from './utils/element-creator';
import View from './utils/view';
import styles from './page.module.scss';
import { localStorageService } from './services/local-storage.service';
import { IUser } from './entity/user';
import AuthPageComponent from './pages/auth/authPage';
import MainPageComponent from './pages/main/mainPage';

export class PageWrapperComponent extends View {
    private static instance: PageWrapperComponent;
    private static exists: boolean;
    wrapper: HTMLElement | null;
    constructor() {
        const params: IElementParams = {
            tag: 'div',
            classNames: [styles.wrapper],
        };
        super(params);
        this.wrapper = null;
        // ======== > singleton < ======== //
        if (PageWrapperComponent.exists) {
            return PageWrapperComponent.instance;
        }
        PageWrapperComponent.instance = this;
        PageWrapperComponent.exists = true;
        // ======== > singleton < ======== //

        this.configureView();
    }

    private configureView() {
        this.wrapper = this.elementCreator.getElement();

        const userLS: IUser | null = localStorageService.getData('user');

        if (userLS?.name.length) {
            this.wrapper.append(new MainPageComponent().getHtmlElement());
        } else {
            this.wrapper.append(new AuthPageComponent().getHtmlElement());
        }
    }

    public rerender() {
        this.wrapper?.replaceChildren();
        this.configureView();
    }
}

export const PageWrapper = () => new PageWrapperComponent();

export interface IPageWrapper extends PageWrapperComponent {}
