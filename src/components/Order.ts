import { Form } from "./Form";
import { IBuyer } from "./../types";
import { IEvents } from "./base/Events";
import { ensureElement } from "./../utils/utils";

export class Order extends Form<IBuyer> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        this.cardButton.addEventListener('click', () => {
            this.onInputChange('payment', 'card');
        });

        this.cashButton.addEventListener('click', () => {
            this.onInputChange('payment', 'cash');
        });
    }

    // Этот сеттер вызывается презентером ТОЛЬКО когда данные в модели обновились
    set payment(value: string) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        const input = this.container.elements.namedItem('address') as HTMLInputElement;
        if (input) {
            input.value = value;
        }
    }
}