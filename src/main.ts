import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Header, Gallery } from './components/Page';
import { CardCatalog, CardPreview, CardBasket } from './components/Card';
import { Modal } from './components/Modal';
import { Form } from './components/Form';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Success } from './components/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer } from './types';

const events = new EventEmitter();
const larekApi = new LarekApi(CDN_URL, new Api(API_URL));

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(document.body); 
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new Order(cloneTemplate(orderTemplate), events);
const contactsView = new Form<IBuyer>(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), {
    onClick: () => modal.close()
});

events.on('catalog:changed', () => {
    const itemCards = catalog.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
    gallery.render({ catalog: itemCards });
});

events.on('card:select', (item: IProduct) => {
    catalog.setPreview(item);
});

events.on('preview:changed', () => {
    const item = catalog.getPreview();
    if (!item) return;

    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('card:toBasket', item)
    });

    modal.render({
        content: card.render({
            ...item,
            buttonText: basket.isInBasket(item.id) ? 'Удалить из корзины' : 'В корзину'
        })
    });
});

events.on('card:toBasket', (item: IProduct) => {
    if (basket.isInBasket(item.id)) {
        basket.removeItem(item.id);
    } else {
        basket.addItem(item);
    }
    modal.close();
});

events.on('basket:changed', () => {
    header.render({ counter: basket.getCount() });
    
    const items = basket.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => basket.removeItem(item.id)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    const content = basketView.render({
        items: items.length > 0 ? items : [(() => {
            const p = document.createElement('p');
            p.textContent = 'Корзина пуста';
            return p;
        })()],
        total: basket.getTotal(),
        valid: basket.getCount() > 0
    });

    if (modal.active && modal.render({}).querySelector('.basket')) {
        modal.render({ content });
    }
});

events.on('basket:open', () => {
    events.emit('basket:changed');
    modal.render({ content: basketView.render() });
});

events.on('buyer:changed', () => {
    const errors = buyer.validate();
    const data = buyer.getData();

    orderView.render({
        payment: data.payment,
        address: data.address,
        valid: !errors.payment && !errors.address,
        errors: ([errors.payment, errors.address].filter(Boolean) as string[])
    });

    contactsView.render({
        email: data.email,
        phone: data.phone,
        valid: !errors.email && !errors.phone,
        errors: ([errors.email, errors.phone].filter(Boolean) as string[])
    });
});

events.on(/^order\..*:change|^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyer.setField(data.field, data.value);
});

events.on('order:open', () => {
    modal.render({ content: orderView.render(buyer.getData()) });
});

events.on('order:submit', () => {
    modal.render({ content: contactsView.render(buyer.getData()) });
});

events.on('contacts:submit', () => {
    larekApi.orderProducts({
        ...buyer.getData(),
        items: basket.getItems().map(item => item.id),
        total: basket.getTotal()
    })
    .then((result) => {
        modal.render({ content: successView.render({ total: result.total }) });
        basket.clear();
        buyer.clear();
        (orderView.render() as HTMLFormElement).reset();
        (contactsView.render() as HTMLFormElement).reset();
    })
    .catch(console.error);
});

larekApi.getProductList()
    .then((data) => {
        catalog.setItems(data.items.map(item => ({
            ...item, 
            image: larekApi.cdn + item.image
        })));
    })
    .catch(console.error);