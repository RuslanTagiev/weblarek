import { IBuyer, FormErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
    protected payment: TPayment | null = null;
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    constructor(protected events: IEvents) {}

    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        Object.assign(this, { [field]: value });
        // Генерируем событие об изменении данных
        this.events.emit('buyer:changed');
    }

    validate(): FormErrors {
        const errors: FormErrors = {};
        if (!this.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.address) errors.address = 'Укажите адрес доставки';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        
        return errors;
    }

    getData(): IBuyer {
        return { payment: this.payment, address: this.address, email: this.email, phone: this.phone };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        // Генерируем событие об очистке данных
        this.events.emit('buyer:changed');
    }
}