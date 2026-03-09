import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IModalData } from '../../types/index';

export class Modal extends Component<IModalData> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._content = container.querySelector('.modal__content') as HTMLElement;
        this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;

        this._closeButton.addEventListener('click', this.close.bind(this));
        container.addEventListener('click', (e) => {
            if (e.target === container) this.close();
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren(); // очищаем содержимое, не вызывая сеттер
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}