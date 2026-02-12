import './scss/styles.scss';

// ============================================
// ИМПОРТЫ
// ============================================
import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { LarekApi } from './components/Models/LarekApi';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { IProduct, IOrder } from './types/index';

// ============================================
// 1. ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ
// ============================================
console.log('========== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ==========');
console.log('1. СОЗДАНИЕ ЭКЗЕМПЛЯРОВ КЛАССОВ');
console.log('----------------------------------------');

const catalogModel = new CatalogModel();
console.log('CatalogModel создан');

const cartModel = new CartModel();
console.log('CartModel создан');

const buyerModel = new BuyerModel();
console.log('BuyerModel создан');

console.log('\n2. ТЕСТИРОВАНИЕ МЕТОДОВ');
console.log('----------------------------------------');

// --- ТЕСТ CATALOGMODEL ---
console.log('\nТЕСТ: CatalogModel');

catalogModel.setProducts(apiProducts.items);
console.log('setProducts() - товары сохранены');
console.log('getProducts() - получено товаров:', catalogModel.getProducts().length);

const firstProduct = catalogModel.getProducts()[0];
const foundProduct = catalogModel.getProduct(firstProduct.id);
console.log('getProduct() - поиск по id:', foundProduct ? 'найден' : 'не найден');

catalogModel.setSelectedCard(firstProduct);
const selectedCard = catalogModel.getSelectedCard();
console.log('setSelectedCard() - товар выбран');
console.log('getSelectedCard() - выбранный товар:', selectedCard?.title);

// --- ТЕСТ CARTMODEL ---
console.log('\nТЕСТ: CartModel');

console.log('getItems() - товаров в корзине:', cartModel.getItems().length);
console.log('getItemCount() - количество:', cartModel.getItemCount());

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('addItem() - добавили 2 товара');

const hasFirst = cartModel.hasItem(apiProducts.items[0].id);
console.log('hasItem() - проверка наличия:', hasFirst);

console.log('getTotalPrice() - сумма корзины:', cartModel.getTotalPrice());

cartModel.removeItem(apiProducts.items[0].id);
console.log('removeItem() - удалили первый товар');
console.log('после удаления товаров:', cartModel.getItemCount());

cartModel.clearCart();
console.log('clearCart() - корзина очищена');
console.log('после очистки товаров:', cartModel.getItemCount());

// --- ТЕСТ BUYERMODEL ---
console.log('\nТЕСТ: BuyerModel');

console.log('getData() - начальные данные:', buyerModel.getData());

buyerModel.setData({ address: 'ул. Пушкина, д.10', payment: 'card' });
console.log('setData() - обновили адрес и оплату');
console.log('после обновления:', buyerModel.getData());

buyerModel.setData({ email: 'test@test.com', phone: '89991234567' });
console.log('setData() - обновили email и телефон');
console.log('после обновления:', buyerModel.getData());

const errors = buyerModel.validate();
console.log('validate() - ошибки валидации:', errors);
console.log('все поля валидны?', Object.keys(errors).length === 0);

buyerModel.clearData();
console.log('clearData() - данные очищены');
console.log('после очистки:', buyerModel.getData());

// ============================================
// 2. РАБОТА С СЕРВЕРОМ
// ============================================
console.log('\n========== РАБОТА С СЕРВЕРОМ ==========');
console.log('1. СОЗДАНИЕ КЛАССА ДЛЯ СВЯЗИ С СЕРВЕРОМ');
console.log('----------------------------------------');

const api = new Api('https://larek-api.nomoreparties.co/api', {
    headers: { 'Content-Type': 'application/json' }
});
console.log('Api создан, baseUrl:', (api as any).baseUrl);

const larekApi = new LarekApi(api);
console.log('LarekApi создан');

console.log('\n2. ЗАПРОС К СЕРВЕРУ И СОХРАНЕНИЕ ДАННЫХ');
console.log('----------------------------------------');

const serverCatalog = new CatalogModel();
console.log('Модель каталога для серверных данных создана');

async function testServerRequests() {
    console.log('\nОтправка GET-запроса к /api/product/...');
    
    try {
        const products = await larekApi.getProductList();
        
        if (products && products.length > 0) {
            console.log('Запрос выполнен успешно');
            console.log('Получено товаров:', products.length);
            
            serverCatalog.setProducts(products);
            console.log('Массив сохранен в модель CatalogModel');
            
            console.log('\nМАССИВ ТОВАРОВ ИЗ МОДЕЛИ:');
            console.log('----------------------------------------');
            const savedProducts = serverCatalog.getProducts();
            
            savedProducts.forEach((product, index) => {
                console.log(`${index + 1}. ${product.title}`);
                console.log(`   ID: ${product.id}`);
                console.log(`   Категория: ${product.category}`);
                console.log(`   Цена: ${product.price !== null ? product.price + '₽' : 'бесценно'}`);
                console.log(`   Описание: ${product.description.substring(0, 50)}...`);
                console.log('----------------------------------------');
            });
            
            console.log('\nТестовая отправка заказа...');
            
            if (savedProducts.length >= 2) {
                const testOrder: IOrder = {
                    payment: 'card',
                    address: 'ул. Тестовая, д. 1',
                    email: 'order@test.com',
                    phone: '89990001122',
                    items: [savedProducts[0].id, savedProducts[1].id],
                    total: (savedProducts[0].price || 0) + (savedProducts[1].price || 0)
                };
                
                const orderResult = await larekApi.sendOrder(testOrder);
                
                if (orderResult) {
                    console.log('Заказ отправлен');
                    console.log('ID заказа:', orderResult.id);
                    console.log('Сумма заказа:', orderResult.total + '₽');
                } else {
                    console.log('Не удалось отправить заказ (сервер недоступен)');
                }
            }
            
        } else {
            console.log('Сервер вернул пустой массив');
        }
        
    } catch (error) {
        console.log('Ошибка при запросе к серверу:', error);
        console.log('Работаем в режиме офлайн-тестирования');
    }
    
    console.log('\n========== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ==========');
}

testServerRequests();