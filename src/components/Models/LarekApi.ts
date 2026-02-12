import { IApi } from '../../types/index';
import { IProduct, IProductsResponse, IOrder, IOrderResult } from '../../types/index';

export class LarekApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    // Получить все товары с сервера
    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this._api.get<IProductsResponse>('/api/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            return [];
        }
    }

    // Отправить заказ
    async sendOrder(order: IOrder): Promise<IOrderResult | null> {
        try {
            const response = await this._api.post<IOrderResult>('/api/order/', order);
            return response;
        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
            return null;
        }
    }
}