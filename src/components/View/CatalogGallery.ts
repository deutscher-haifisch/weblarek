import { Component } from '../base/Component';

export class CatalogGallery extends Component<{ items: HTMLElement[] }> {
    protected _container: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._container = container;
    }

    set items(items: HTMLElement[]) {
        this._container.replaceChildren(...items);
    }
}