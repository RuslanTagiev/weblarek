import { IApi, IOrder, IOrderResult, IProduct, IProductList } from '../types';

export class LarekApi {
    private _api: IApi;
    readonly cdn: string;

    constructor(cdn: string, api: IApi) {
        this._api = api;
        this.cdn = cdn;
    }

    // Получение списка товаров
    getProductList(): Promise<IProduct[]> {
        return this._api.get<IProductList>('/product').then((data) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    // Отправка заказа
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order).then((data) => data);
    }
}