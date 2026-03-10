export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Базовый интерфейс для брокера событий
export interface IEvents {
    on<T extends object>(event: string, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
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

// ========== ПРЕДСТАВЛЕНИЕ ==========

// Действия для карточек (колбэки)
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// Состояние формы
export interface IFormState {
    valid: boolean;
    errors: string[];
}

// Данные для отображения корзины
export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

// Данные для отображения страницы
export interface IPageView {
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}

// Данные для модального окна
export interface IModalData {
    content: HTMLElement;
}

// Действия для окна успеха
export interface ISuccessActions {
    onClick: () => void;
}