import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected counterElement: HTMLElement;
    protected catalogElement: HTMLElement;
    protected wrapperElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter');
        this.catalogElement = ensureElement<HTMLElement>('.gallery');
        this.wrapperElement = ensureElement<HTMLElement>('.page__wrapper');
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.counterElement, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this.wrapperElement.classList.add('page__wrapper_locked');
        } else {
            this.wrapperElement.classList.remove('page__wrapper_locked');
        }
    }
}