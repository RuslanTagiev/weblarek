import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor(protected events: IEvents) {} // Добавили события

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:changed', { items: this.items }); // Уведомляем об обновлении
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit('card:select', item); // Генерируем событие выбора
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}