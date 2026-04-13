import { IApi, IOrder, IOrderResult, IProductList, IProduct } from '../types';

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

    getProductItem(id: string): Promise<IProduct> {
        return this._api.get<IProduct>(`/product/${id}`);
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order);
    }
}