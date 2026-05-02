import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected closeButton: HTMLButtonElement;
    protected totalElement: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);

        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.setText(this.totalElement, `Списано ${value} синапсов`);
    }
}