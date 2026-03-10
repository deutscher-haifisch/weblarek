import { Card } from './Card';
import { IProduct } from '../../types/index';

export class PreviewCard extends Card<IProduct> {
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;
    protected _description: HTMLElement | null;
    protected _button: HTMLButtonElement | null;
    private _priceValue: number | null = null;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container); // НЕ передаём actions
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._description = container.querySelector('.card__text');
        this._button = container.querySelector('.card__button');

        if (actions?.onClick && this._button) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
        }
    }

    set description(value: string) {
        if (this._description) this.setText(this._description, value);
    }

    set price(value: number | null) {
        super.price = value;
        this._priceValue = value;
    }

    set buttonState(inBasket: boolean) {
        if (!this._button) return;
        if (this._priceValue === null) {
            this._button.textContent = 'Недоступно';
            this._button.disabled = true;
        } else {
            this._button.textContent = inBasket ? 'Удалить из корзины' : 'В корзину';
            this._button.disabled = false;
        }
    }
}