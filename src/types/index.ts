export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Способы оплаты
export type TPayment = 'online' | 'cash';

//Товар
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Покупатель
export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

// Интерфейс для хранения ошибок валидации
export type FormErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейс всего заказа для API
export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

// Тип для списка товаров
export interface IProductList {
    total: number;
    items: IProduct[];
}

// Результат заказа
export interface IOrderResult {
    id: string;
    total: number;
}


