import { IBuyer, TPayment, TBuyerErrors } from '../../types/index';

export class BuyerModel {
    private _payment: TPayment = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    constructor() {}

    // частичное обновление данных
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
    }

    // получить все данные
    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    // очистить данные
    clearData(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    // валидация
    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this._address.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        if (!this._email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this._phone.trim()) {
            errors.phone = 'Введите номер телефона';
        }

        return errors;
    }

}