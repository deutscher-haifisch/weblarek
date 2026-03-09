import { Card } from './Card';
import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';

export class CatalogCard extends Card<IProduct> {
    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container, actions);
    }

    set category(value: string) {
        console.log('CatalogCard: устанавливаем категорию', value);
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || '';
            this._category.classList.add(categoryClass);
            console.log('CatalogCard: класс категории добавлен', categoryClass);
        } else {
            console.warn('CatalogCard: элемент _category не найден');
        }
    }
}