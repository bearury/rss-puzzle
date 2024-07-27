import ElementCreator, { IElementParams } from './element-creator.ts';

interface IElementCreator extends ElementCreator {}

export default class View {
    elementCreator: IElementCreator;
    constructor(params: IElementParams) {
        this.elementCreator = this.createView(params);
    }

    getHtmlElement() {
        return this.elementCreator.getElement();
    }

    createView(params: IElementParams) {
        const elementParams = {
            tag: params.tag,
            classNames: params.classNames,
            textContent: params.textContent,
            callback: params.callback,
            attribute: params.attribute,
        };
        return new ElementCreator(elementParams);
    }
}
