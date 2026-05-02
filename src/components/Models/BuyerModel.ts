import { IBuyer, FormErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
    protected payment: TPayment | null = null;
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';
    formErrors: FormErrors = {}; // Добавили поле для хранения ошибок

    constructor(protected events: IEvents) {}

    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        Object.assign(this, { [field]: value });
        
        // После каждого изменения проверяем валидность
        if (this.validate()) {
            this.events.emit('order:ready', this.getData());
        }
    }

    validate(): boolean {
        const errors: FormErrors = {};
        if (!this.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.address) errors.address = 'Укажите адрес доставки';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors); // Уведомляем View об ошибках
        return Object.keys(errors).length === 0;
    }

    getData(): IBuyer {
        return { payment: this.payment, address: this.address, email: this.email, phone: this.phone };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.formErrors = {};
    }
}