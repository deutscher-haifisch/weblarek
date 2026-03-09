import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class CatalogModel {
    private _products: IProduct[] = [];
    private _selectedCard: IProduct | null = null;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

setProducts(products: IProduct[]): void {
    console.log('2. setProducts вызван, получено товаров:', products.length);
    this._products = products;
    console.log('3. Товары сохранены в _products, длина:', this._products.length);
    this.events.emit('catalog:changed');
    console.log('4. Событие catalog:changed отправлено');
}

    getProducts(): IProduct[] {
        return this._products;
    }

    getProduct(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    setSelectedCard(product: IProduct | null): void {
        this._selectedCard = product;
        this.events.emit('card:selected', { product: this._selectedCard });
    }

    getSelectedCard(): IProduct | null {
        return this._selectedCard;
    }
}