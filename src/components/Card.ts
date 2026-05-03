import { Component } from "./base/Component";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { categoryMap } from "../utils/constants";

export type CategoryKey = keyof typeof categoryMap;

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

/**
 * Базовый интерфейс для карточки
 */
export interface ICard extends IProduct {
    index?: number;
    buttonText?: string;
}

/**
 * БАЗОВЫЙ КЛАСС: Заголовок и цена
 */
export class Card<T = ICard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.priceElement = ensureElement<HTMLElement>(`.${blockName}__price`, container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${value} синапсов` : "Бесценно";
    }
}

/**
 * КАРТОЧКА КАТАЛОГА: Данные согласно видео (image + category)
 */
export type TCardCatalog = Pick<IProduct, 'image' | 'category' | 'title' | 'price'>;

export class CardCatalog extends Card<TCardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey], 
                key === value
            );
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }
}

/**
 * КАРТОЧКА ПРЕВЬЮ: Расширяем данные для модального окна
 */
interface ICardPreview extends IProduct {
    buttonText: string;
}

export class CardPreview extends CardCatalog {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            container.removeEventListener('click', actions.onClick);
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    // Переопределяем render для типизации Preview данных
    render(data?: Partial<ICardPreview>): HTMLElement {
        return super.render(data);
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${value} синапсов` : "Бесценно";
        if (this.buttonElement && value === null) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = "Недоступно";
        }
    }
}

/**
 * КАРТОЧКА КОРЗИНЫ: Добавляем индекс
 */
interface ICardBasket extends IProduct {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this.container.removeEventListener('click', actions.onClick);
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}