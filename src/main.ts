import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Form } from './components/Form';
import { Basket } from './components/Basket'; // Добавлен импорт
import { Order } from './components/Order'; // Добавлен импорт
import { Success } from './components/Success'; // Добавлен импорт
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer } from './types';

//  ИНИЦИАЛИЗАЦИЯ БАЗОВЫХ СЕРВИСОВ 

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(CDN_URL, baseApi);

//  МОДЕЛИ ДАННЫХ 

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

//  ШАБЛОНЫ 

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//  КОМПОНЕНТЫ ПРЕДСТАВЛЕНИЯ 

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new Order(cloneTemplate(orderTemplate), events);
const contactsView = new Form<IBuyer>(cloneTemplate(contactsTemplate), events); // Используем класс Order для контактов

//  ЛОГИКА ПРЕЗЕНТЕРА (ОБРАБОТКА СОБЫТИЙ) 

// Выводим каталог на страницу
events.on('items:changed', () => {
    const cardsArray = catalog.getItems().map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            price: item.price
        });
    });
    page.render({ catalog: cardsArray });
});

// Открытие превью товара
events.on('card:select', (item: IProduct) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (!basket.isInBasket(item.id)) {
                basket.addItem(item);
            } else {
                basket.removeItem(item.id);
            }
            modal.close();
        }
    });

    const buttonText = basket.isInBasket(item.id) ? 'Удалить из корзины' : 'В корзину';
    // Обновляем текст кнопки через метод базового компонента
    if (card['buttonElement']) {
        card['setText'](card['buttonElement'], buttonText);
    }

    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            price: item.price,
        })
    });
});

// Открытие корзины
events.on('basket:open', () => {
    const items = basket.getItems().map((item, index) => {
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                basket.removeItem(item.id);
                events.emit('basket:open'); // Перерисовываем открытую корзину
            }
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        } as any);
    });

    modal.render({
        content: basketView.render({
            items: items,
            total: basket.getTotal()
        })
    });
});

// Переход к оформлению (первый шаг)
events.on('order:open', () => {
    modal.render({
        content: orderView.render({
            payment: null,
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Обработка ввода в формах
events.on(/^order\..*:change|^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyer.setField(data.field, data.value);
});

// Валидация форм
events.on('formErrors:change', (errors: Partial<IBuyer>) => {
    const { payment, address, email, phone } = errors;
    orderView.valid = !payment && !address;
    contactsView.valid = !email && !phone;
    orderView.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
    contactsView.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Переход ко второму шагу
events.on('order:submit', () => {
    modal.render({
        content: contactsView.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

// Финальная оплата
events.on('contacts:submit', () => {
    larekApi.orderProducts({
        ...buyer.getData(),
        items: basket.getItems().map(item => item.id),
        total: basket.getTotal()
    })
    .then((result) => {
        const success = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close();
            }
        });

        // Очищаем модели
        basket.clear();
        buyer.clear();

        // Сбрасываем визуальное состояние первой формы
        orderView.render({
            payment: null,
            address: '',
            valid: false,
            errors: []
        });

        // Сбрасываем визуальное состояние второй формы (явно передаем пустые строки для полей)
        contactsView.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        });
        
        // Обнуляем счетчик на главной
        page.counter = 0;

        // Показываем окно успеха
        modal.render({
            content: success.render({ total: result.total })
        });
    })
    .catch(console.error);
});

// Обновление счетчика и блокировка скролла
events.on('basket:changed', () => { page.counter = basket.getCount(); });
events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

//  ЗАГРУЗКА ДАННЫХ С СЕРВЕРА 

larekApi.getProductList()
    .then((data) => {
        const itemsWithCdn = data.items.map(item => ({
            ...item,
            image: larekApi.cdn + item.image
        }));
        catalog.setItems(itemsWithCdn);
    })
    .catch(console.error);