import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class BasketCounter extends Component<{ value: number }> {
    protected _counter: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
        container.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set value(value: number) {
        this.setText(this._counter, value.toString());
    }
}