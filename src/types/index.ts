export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// ДОБАВЛЯЕМ НАШИ ИНТЕРФЕЙСЫ:

// Тип для способа оплаты
export type TPayment = 'card' | 'cash' | '';

// Интерфейс товара
export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
}

// Интерфейс покупателя
export interface IBuyer {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

// Интерфейс для ошибок валидации покупателя
export interface IBuyerErrors {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}

// ========== СЕРВЕР ==========

// Ответ сервера со списком товаров
export interface IProductsResponse {
    items: IProduct[];
}

// Данные для отправки заказа
export interface IOrder {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
    items: string[];  // массив id товаров
    total: number;
}

// Ответ сервера после отправки заказа
export interface IOrderResult {
    id: string;
    total: number;
}