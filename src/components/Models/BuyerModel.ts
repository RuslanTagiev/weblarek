import { IBuyer, FormErrors, TPayment } from '../../types';

export class BuyerModel {
    protected payment: TPayment | null = null;
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    // Используем Object.assign для обхода ограничения TS при записи в защищенные поля по ключу.
setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    Object.assign(this, { [field]: value });
}
    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    validate(): FormErrors {
        const errors: FormErrors = {};
        if (!this.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.address) errors.address = 'Укажите адрес доставки';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        
        return errors;
    }
}