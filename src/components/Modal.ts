import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

interface IModalData {
    content: HTMLElement | null;
}

export class Modal extends Component<IModalData> {
    // Используем понятные имена без подчеркиваний
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        // Привязываем события
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        
        // Клик внутри контента не должен закрывать модалку
        this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    }

    // Сеттер для вставки контента
    set content(value: HTMLElement | null) {
        if (value) {
            this.contentElement.replaceChildren(value);
        } else {
            this.contentElement.innerHTML = '';
        }
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null; // Очищаем через сеттер
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}