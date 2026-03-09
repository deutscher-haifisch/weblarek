import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { IFormState } from '../../types/index';

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected events: EventEmitter;
    protected inputs: Map<string, HTMLInputElement> = new Map();

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._submit = container.querySelector('button[type=submit]') as HTMLButtonElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;

        container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            this.onInputChange(field, target.value);
        });

        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });

        container.querySelectorAll('input').forEach(input => {
            this.inputs.set(input.name, input);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit('form:change', { field, value });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state?: Partial<T> & IFormState): HTMLElement {
        if (state) {
            const { valid, errors, ...inputs } = state;
            super.render({ valid, errors });
            Object.assign(this, inputs);
        } else {
            super.render();
        }
        return this.container;
    }
}