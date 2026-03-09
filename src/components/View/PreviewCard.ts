import { Card } from './Card';
import { IProduct } from '../../types/index';

export class PreviewCard extends Card<IProduct> {
    protected _description: HTMLElement | null;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container, actions);
        this._description = container.querySelector('.card__description');
    }

    set description(value: string) {
        if (this._description) this.setText(this._description, value);
    }

    set buttonState(inBasket: boolean) {
        this.buttonText = inBasket ? 'Удалить из корзины' : 'В корзину';
    }
}