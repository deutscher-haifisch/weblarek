import { Component } from '../base/Component';
import { IProduct, ICardActions } from '../../types/index';

export class Card<T extends IProduct> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
        console.log('Card container innerHTML:', container.innerHTML);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (this._button && value === null) {
            this._button.disabled = true;
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

    set buttonText(value: string) {
        if (this._button) this.setText(this._button, value);
    }

    set disabled(value: boolean) {
        if (this._button) this._button.disabled = value;
    }
}