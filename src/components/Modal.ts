import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

interface IModalData {
    content?: HTMLElement | null;
}

export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;
    protected _active: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    }

    // Геттер для проверки состояния окна из Презентера
    get active() {
        return this._active;
    }

    set content(value: HTMLElement | null) {
        // Используем оператор нулевого слияния для очистки контента
        this.contentElement.replaceChildren(value ?? '');
    }

    open() {
        this.container.classList.add('modal_active');
        this._active = true;
        // Блокируем скролл страницы напрямую
        document.body.classList.add('page__wrapper_locked');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null; 
        this._active = false;
        // Разблокируем скролл страницы напрямую
        document.body.classList.remove('page__wrapper_locked');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}