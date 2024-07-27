import { IPageWrapper, PageWrapper } from './page';

class App {
    pageWrapper: IPageWrapper;
    root: HTMLElement;
    constructor(pageWrapper: IPageWrapper, root: HTMLElement) {
        this.pageWrapper = pageWrapper;
        this.root = root;
    }

    public start(): void {
        this.root.append(this.pageWrapper.getHtmlElement());
    }
}

const app = new App(PageWrapper(), document.querySelector<HTMLElement>('body')!);

app.start();
