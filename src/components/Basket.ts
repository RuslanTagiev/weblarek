import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this.listElement.replaceChildren(...items);
            this.setDisabled(this.buttonElement, false);
        } else {
            const message = document.createElement('p');
            this.setText(message, 'Корзина пуста');
            this.listElement.replaceChildren(message);
            this.setDisabled(this.buttonElement, true);
        }
    }
    set total(total: number) {
        this.setText(this.totalElement, `${total} синапсов`);
    }
}