export interface IElementParams {
    tag: keyof HTMLElementTagNameMap;
    classNames?: Array<string>;
    textContent?: string;
    callback?: Array<{ event: 'click' | 'submit' | 'input'; callback: Function }>;
    attribute?: Array<{ id: string; value: string }>;
    children?: Array<Element>;
}

export default class ElementCreator {
    element: HTMLElement;
    constructor(params: IElementParams) {
        this.element = document.createElement(params.tag);
        this.createElement(params);
    }

    createElement(params: IElementParams) {
        if (params.classNames && params.classNames.length) {
            this.setClasses(params.classNames);
        }
        if (params.textContent && params.textContent.length) {
            this.setTextContent(params.textContent);
        }

        if (params.callback && params.callback.length) {
            this.setCallback(params.callback);
        }
        if (params.attribute && params.attribute.length) {
            this.setAttribute(params.attribute);
        }

        if (params.children && params.children.length) {
            this.setChildren(params.children);
        }
    }

    getElement(): HTMLElement | HTMLImageElement {
        return this.element;
    }

    setClasses(classes: Array<string> | undefined) {
        classes?.forEach((className) => this.element.classList.add(className));
    }

    setTextContent(text: string) {
        this.element.textContent = text;
    }

    setCallback(callbacks: Array<{ event: 'click' | 'submit' | 'input'; callback: Function }>) {
        if (callbacks.length && this.element) {
            callbacks.forEach((c) => this.element.addEventListener(c.event, (e) => c.callback(e)));
        }
    }

    setAttribute(attr: Array<{ id: string; value: string }>) {
        if (attr) {
            attr.forEach((a) => this.element.setAttribute(a.id, a.value));
        }
    }

    setChildren(children: Array<Element>) {
        if (children.length) {
            children.forEach((ch) => this.element.append(ch));
        }
    }
}
