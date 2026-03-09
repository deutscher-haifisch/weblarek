import { Form } from './Form';
import { IBuyer } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends Form<IBuyer> {
    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);
    }

    set email(value: string) {
        const input = this.inputs.get('email') as HTMLInputElement;
        if (input) input.value = value;
    }

    set phone(value: string) {
        const input = this.inputs.get('phone') as HTMLInputElement;
        if (input) input.value = value;
    }
}