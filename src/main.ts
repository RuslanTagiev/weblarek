import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';

// --- 1. ТЕСТИРОВАНИЕ МОДЕЛЕЙ (НА ТЕСТОВЫХ ДАННЫХ) ---

const catalog = new CatalogModel();
catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getItems());

const firstProduct = apiProducts.items[0].id;
console.log('Получение одного товара по id:', catalog.getItem(firstProduct));

catalog.setPreview(apiProducts.items[0]);
console.log('Предпросмотр:', catalog.getPreview());

const basket = new BasketModel();
const productBuy = apiProducts.items[0];

basket.addItem(productBuy);
console.log('Корзина:', basket.getItems());
console.log('Общее количество товаров в корзине:', basket.getCount());
console.log('Общая стоимость товаров в корзине:', basket.getTotal());
console.log('Проверка наличия товара в корзине:', basket.isInBasket(productBuy.id));

basket.removeItem(productBuy.id);
console.log('Удаление товара из корзины:', basket.getItems());

basket.addItem(productBuy);
basket.clear();
console.log('Пустая корзина:', basket.getItems());

const buyer = new BuyerModel();
buyer.setData('address', 'ул. ..., дом ...');
console.log('Данные покупателя:', buyer.getData());
console.log('Валидация данных покупателя (есть ошибки):', buyer.validate());

buyer.setData('payment', 'online');
buyer.setData('email', '...@mail.ru');
buyer.setData('phone', '+7...');
console.log('Валидация данных покупателя (нет ошибок):', buyer.validate());

buyer.clear();
console.log('Покупатель: данные после очистки:', buyer.getData());


// --- 2. ПОДКЛЮЧЕНИЕ СЕРВЕРА И ИТОГОВАЯ ПРОВЕРКА ---

// Создаем экземпляр базового класса API
const baseApi = new Api(API_URL);

// Создаем экземпляр нашего класса коммуникации (композиция)
const larekApi = new LarekApi(CDN_URL, baseApi);

// Выполняем реальный запрос на сервер
larekApi.getProductList()
    .then((items) => {
        // Наполняем ту же самую модель catalog реальными данными
        catalog.setItems(items);

        console.log('--- ИТОГ ПЕРВОЙ ЧАСТИ ---');
        console.log('Каталог успешно наполнен данными с сервера:', catalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при загрузке данных с сервера:', err);
    });