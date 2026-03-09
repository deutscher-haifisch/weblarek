import { Card } from './Card';
import { IProduct } from '../../types/index';

export class BasketCard extends Card<IProduct> {
    protected _index: HTMLElement | null;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container, actions);
        this._index = container.querySelector('.basket__item-index');
    }

    set index(value: number) {
        if (this._index) this.setText(this._index, value.toString());
    }
}