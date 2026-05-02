import { Component } from "./base/Component";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { categoryMap } from "../utils/constants";

export type CategoryKey = keyof typeof categoryMap;

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected categoryElement?: HTMLElement;
  protected textElement?: HTMLElement;
  protected buttonElement?: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActions,
  ) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      `.${blockName}__title`,
      container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      `.${blockName}__price`,
      container,
    );
    // Используем 'as', чтобы подсказать TypeScript конкретный тип элемента
    this.buttonElement = container.querySelector(
      `.${blockName}__button`,
    ) as HTMLButtonElement;
    this.imageElement = container.querySelector(
      `.${blockName}__image`,
    ) as HTMLImageElement;
    this.categoryElement = container.querySelector(
      `.${blockName}__category`,
    ) as HTMLElement;
    this.textElement = container.querySelector(
      `.${blockName}__text`,
    ) as HTMLElement;

    if (actions?.onClick) {
      if (this.buttonElement) {
        this.buttonElement.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  set price(value: number | null) {
    this.setText(this.priceElement, value ? `${value} синапсов` : "Бесценно");
    if (this.buttonElement && value === null) {
      this.setDisabled(this.buttonElement, true);
      this.setText(this.buttonElement, "Недоступно");
    }
  }

  set category(value: CategoryKey) {
    if (this.categoryElement) {
      this.setText(this.categoryElement, value);
      this.categoryElement.className = `card__category ${categoryMap[value]}`;
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value, this.title);
    }
  }

  set description(value: string) {
    if (this.textElement) {
      this.setText(this.textElement, value);
    }
  }
}
