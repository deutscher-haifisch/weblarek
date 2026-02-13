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


// Тип для ошибок валидации покупателя
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;


// ========== СЕРВЕР ==========

// Ответ сервера со списком товаров
export interface IProductsResponse {
    items: IProduct[];
    total: number;
}

// Данные для отправки заказа
export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

// Ответ сервера после отправки заказа
export interface IOrderResult {
    id: string;
    total: number;
}