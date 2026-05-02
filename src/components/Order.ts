import { Form } from '../components/Form';
import { IBuyer } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IBuyer> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        this.cardButton.addEventListener('click', () => {
            this.payment = 'online';
            this.onInputChange('payment', 'online');
        });

        this.cashButton.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'cash');
        });
    }

    set payment(value: string) {
        this.cardButton.classList.toggle('button_alt-active', value === 'online');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}