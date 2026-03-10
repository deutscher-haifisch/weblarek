import { Component } from '../base/Component';

export class BasketCounter extends Component<{ value: number }> {
    protected _counter: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._counter = container;
    }

    set value(value: number) {
        this.setText(this._counter, value.toString());
    }
}