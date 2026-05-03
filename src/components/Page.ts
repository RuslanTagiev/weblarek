import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { ensureElement } from "./../utils/utils";

interface HeaderData {
    counter: number;
}

export class Header extends Component<HeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}

interface GalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
    protected catalogElement: HTMLElement; 

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = ensureElement<HTMLElement>('.gallery', container);
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}