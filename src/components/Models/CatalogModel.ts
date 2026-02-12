import { IProduct } from '../../types/index';

export class CatalogModel {
    private _products: IProduct[] = [];
    private _selectedCard: IProduct | null = null;

    constructor() {}

    // сохранить массив товаров
    setProducts(products: IProduct[]): void {
        this._products = products;
    }

    // получить все товары
    getProducts(): IProduct[] {
        return this._products;
    }

    // получить товар по id
    getProduct(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    // сохранить выбранный товар
    setSelectedCard(product: IProduct): void {
        this._selectedCard = product;
    }

    // получить выбранный товар
    getSelectedCard(): IProduct | null {
        return this._selectedCard;
    }
}