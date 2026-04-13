import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';

//  ТЕСТИРОВАНИЕ МОДЕЛЕЙ 

const catalog = new CatalogModel(); // Объявляем один раз в начале
catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getItems());

const firstProduct = apiProducts.items[0].id;
console.log('Получение одного товара по id:', catalog.getItem(firstProduct));

catalog.setPreview(apiProducts.items[0]);
console.log('Предпросмотр:', catalog.getPreview());

const basket = new BasketModel();
const productBuy1 = apiProducts.items[0];
const productBuy2 = apiProducts.items[1];
const productBuy3 = apiProducts.items[2];

basket.addItem(productBuy1);
basket.addItem(productBuy2);
basket.addItem(productBuy3);

console.log('Корзина:', basket.getItems());
console.log('Общее количество товаров в корзине:', basket.getCount());
console.log('Общая стоимость товаров в корзине:', basket.getTotal());

basket.removeItem(productBuy2.id);
console.log('Удаление одного товара из корзины:', basket.getItems());
console.log('Проверка наличия удаленного товара (ожидаем false):', basket.isInBasket(productBuy2.id));
console.log('Новая сумма:', basket.getTotal());

basket.clear();
console.log('Пустая корзина:', basket.getItems());

const buyer = new BuyerModel();
buyer.setField('address', 'ул. ..., дом ...');
console.log('Данные покупателя:', buyer.getData());
console.log('Валидация данных покупателя (есть ошибки):', buyer.validate());


buyer.setField('payment', 'online'); 
buyer.setField('email', '...@mail.ru');
buyer.setField('phone', '+7...');
console.log('Валидация данных покупателя (нет ошибок):', buyer.validate());

buyer.clear();
console.log('Покупатель: данные после очистки:', buyer.getData());


//  ПОДКЛЮЧЕНИЕ СЕРВЕРА 

const baseApi = new Api(API_URL);
const larekApi = new LarekApi(CDN_URL, baseApi);

// Выполняем запрос
larekApi.getProductList()
    .then((data) => {
    
        const itemsWithCdn = data.items.map(item => ({
            ...item,
            image: larekApi.cdn + item.image
        }));
        
        catalog.setItems(itemsWithCdn);

        console.log('--- ИТОГ ПЕРВОЙ ЧАСТИ ---');
        console.log('Данные с сервера с CDN ссылками:', catalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при загрузке данных с сервера:', err);
    });