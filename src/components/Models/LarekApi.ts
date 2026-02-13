import { IApi } from '../../types/index';
import { IProduct, IProductsResponse, IOrder, IOrderResult } from '../../types/index';

export class LarekApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    // Получить все товары с сервера
    async getProductList(): Promise<IProduct[]> {
        const response = await this._api.get<IProductsResponse>('/product/');
        return response.items;
    }

    // Отправить заказ
    async sendOrder(order: IOrder): Promise<IOrderResult> {
        const response = await this._api.post<IOrderResult>('/order/', order);
        return response;
    }
}