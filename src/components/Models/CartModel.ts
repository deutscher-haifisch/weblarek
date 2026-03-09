import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class CartModel {
    private _items: IProduct[] = [];
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (product.price === null) {
            console.log('Этот товар нельзя добавить в корзину (бесценный)');
            return;
        }
        if (!this.hasItem(product.id)) {
            this._items.push(product);
            this.events.emit('cart:changed', { items: this._items });
        }
    }

    removeItem(productId: string): void {
        const initialLength = this._items.length;
        this._items = this._items.filter(item => item.id !== productId);
        if (this._items.length !== initialLength) {
            this.events.emit('cart:changed', { items: this._items });
        }
    }

    clearCart(): void {
        this._items = [];
        this.events.emit('cart:changed', { items: this._items });
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