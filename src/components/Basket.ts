import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

// 1. Добавляем valid в интерфейс
interface IBasketView {
    items: HTMLElement[];
    total: number;
    valid: boolean; 
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

    // 2. Добавляем сеттер valid
    set valid(value: boolean) {
        this.buttonElement.disabled = !value;
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
    }

    set total(total: number) {
        this.totalElement.textContent = `${total} синапсов`; 
    }
}
