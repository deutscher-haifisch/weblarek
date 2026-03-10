import { Card } from './Card';
import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';

export class CatalogCard extends Card<IProduct> {
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container, actions); 
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || '';
            this._category.classList.add(categoryClass);
        }
    }
}