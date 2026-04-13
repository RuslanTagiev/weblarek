import { IProduct } from '../../types';

export class BasketModel {
    protected items: IProduct[] = [];

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clear(): void {
        this.items = [];
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    isInBasket(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}