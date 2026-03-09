import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IPageView } from '../../types/index';

export class Page extends Component<IPageView> {
    protected _catalog: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _wrapper: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._catalog = container.querySelector('.gallery') as HTMLElement;
        this._basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;
        console.log('Page: галерея найдена?', this._catalog);

        const basketButton = container.querySelector('.header__basket');
        if (basketButton) {
            basketButton.addEventListener('click', () => {
                this.events.emit('basket:open');
            });
        }
    }

    set catalog(items: HTMLElement[]) {
        console.log('Page.catalog: получено элементов:', items.length);
        this._catalog.replaceChildren(...items);
        console.log('Page.catalog: галерея обновлена');
    }

    set counter(value: number) {
        this.setText(this._basketCounter, value.toString());
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}