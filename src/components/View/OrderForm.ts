import { Form } from './Form';
import { IOrder, TPayment } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class OrderForm extends Form<IOrder> {
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);
        this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.name as 'card' | 'cash';
                // Только уведомляем презентер, не меняем UI напрямую
                this.events.emit('order:paymentChange', { payment: value });
            });
        });
    }

    // Сеттер для обновления состояния кнопок – вызывается презентером
    // после изменения модели (через событие buyer:changed)
    set payment(value: TPayment) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        const input = this.inputs.get('address') as HTMLInputElement;
        if (input) input.value = value;
    }
}