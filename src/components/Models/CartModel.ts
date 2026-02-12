import { IProduct } from '../../types/index';

export class CartModel {
    private _items: IProduct[] = [];

    constructor() {}

    // получить все товары в корзине
    getItems(): IProduct[] {
        return this._items;
    }

    // добавить товар в корзину
    addItem(product: IProduct): void {
        if (product.price === null) {
            console.log('Этот товар нельзя добавить в корзину (бесценный)');
            return;
        }
        if (!this.hasItem(product.id)) {
            this._items.push(product);
        }
    }

    // удалить товар из корзины
    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
    }

    // очистить корзину
    clearCart(): void {
        this._items = [];
    }

    // общая сумма товаров
    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    // количество товаров
    getItemCount(): number {
        return this._items.length;
    }

    // проверить наличие товара в корзине
    hasItem(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}