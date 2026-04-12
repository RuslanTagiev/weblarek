import { IBuyer, FormErrors } from '../../types';

export class BuyerModel {
    payment: string = '';
    address: string = '';
    email: string = '';
    phone: string = '';
    formErrors: FormErrors = {};

    setData(field: keyof IBuyer, value: string): void {
        this[field] = value;
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
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.formErrors = {};
    }

    validate(): FormErrors {
        const errors: FormErrors = {};
        if (!this.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.address) errors.address = 'Укажите адрес доставки';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        
        this.formErrors = errors;
        return errors;
    }
}