import { Card } from './Card';
import { IProduct } from '../../types/index';

export class BasketCard extends Card<IProduct> {
    protected _index: HTMLElement | null;
    protected _deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container); // НЕ передаём actions
        this._index = container.querySelector('.basket__item-index');
        this._deleteButton = container.querySelector('.basket__item-delete');

        if (actions?.onClick && this._deleteButton) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        if (this._index) this.setText(this._index, value.toString());
    }
}