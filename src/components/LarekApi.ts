import { IApi, IOrder, IOrderResult, IProductList } from '../types';

export class LarekApi {
    private _api: IApi;
    readonly cdn: string;

    constructor(cdn: string, api: IApi) {
        this._api = api;
        this.cdn = cdn;
    }

    getProductList(): Promise<IProductList> {
        return this._api.get<IProductList>('/product');
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order);
    }
}