import { IProduct } from '../../types/index';
import { IEvents } from '../../types/index';

export class CatalogModel {
    private _products: IProduct[] = [];
    private _selectedCard: IProduct | null = null;
    protected events: IEvents; 

    constructor(events: IEvents) {
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('catalog:changed'); 
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProduct(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    setSelectedCard(product: IProduct | null): void {
        this._selectedCard = product;
        this.events.emit('card:selected');
    }

    getSelectedCard(): IProduct | null {
        return this._selectedCard;
    }
}