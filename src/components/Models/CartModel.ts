import { IProduct } from '../../types/index';
import { IEvents } from '../../types/index';

export class CartModel {
    private _items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (product.price === null) return;
        if (!this.hasItem(product.id)) {
            this._items.push(product);
            this.events.emit('cart:changed'); // данные убраны
        }
    }

    removeItem(productId: string): void {
        const initialLength = this._items.length;
        this._items = this._items.filter(item => item.id !== productId);
        if (this._items.length !== initialLength) {
            this.events.emit('cart:changed'); // данные убраны
        }
    }

    clearCart(): void {
        this._items = [];
        this.events.emit('cart:changed'); // данные убраны
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getItemCount(): number {
        return this._items.length;
    }

    hasItem(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}