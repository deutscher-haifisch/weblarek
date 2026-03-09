import './scss/styles.scss';

// Базовые классы
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

// Модели
import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { LarekApi } from './components/Models/LarekApi';

// Представления
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';

// Константы и типы
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder } from './types/index';

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

const events = new EventEmitter();
const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
const larekApi = new LarekApi(api);

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Модальное окно 
const modalElement = document.querySelector('.modal') as HTMLElement;
if (!modalElement) throw new Error('Modal element not found');
const modal = new Modal(modalElement, events);

// Корзина 
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
if (!basketTemplate) throw new Error('Basket template not found');
const basketElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
if (!basketElement) throw new Error('Failed to create basket element');
const basket = new Basket(basketElement, events);

// Форма заказа 
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
if (!orderTemplate) throw new Error('Order template not found');
const orderElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
if (!orderElement) throw new Error('Failed to create order element');
const orderForm = new OrderForm(orderElement, events);

// Форма контактов 
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
if (!contactsTemplate) throw new Error('Contacts template not found');
const contactsElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
if (!contactsElement) throw new Error('Failed to create contacts element');
const contactsForm = new ContactsForm(contactsElement, events);

// Сообщение об успехе
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
if (!successTemplate) throw new Error('Success template not found');
const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
if (!successElement) throw new Error('Failed to create success element');
const success = new Success(successElement, { onClick: () => modal.close() });

const page = new Page(document.body, events);

let currentForm: 'order' | 'contacts' | null = null;

// Вспомогательная функция для обновления валидации текущей формы
function updateFormValidity() {
    const errors = buyerModel.validate();
    if (currentForm === 'order') {
        orderForm.valid = !errors.payment && !errors.address;
        orderForm.errors = errors.payment || errors.address || '';
    } else if (currentForm === 'contacts') {
        contactsForm.valid = !errors.email && !errors.phone;
        contactsForm.errors = errors.email || errors.phone || '';
    }
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ
// ============================================

// Каталог изменился – перерисовываем галерею
events.on('catalog:changed', () => {
    console.log('Событие catalog:changed получено');
    const products = catalogModel.getProducts();
    console.log('Товары из модели:', products);
    const cardElements = products.map(item => {
        const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
            if (!template) throw new Error('Template #card-catalog not found');
            const cardElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
            if (!cardElement) throw new Error('Failed to clone catalog card');
            const card = new CatalogCard(cardElement, { onClick: () => events.emit('card:select', { id: item.id }) });
        card.title = item.title;
        card.price = item.price;
        card.image = CDN_URL + item.image;
        card.category = item.category;
        return card.render();
    });
    page.catalog = cardElements;
});

// Выбран новый товар – открываем модалку с превью
events.on('card:selected', () => {
    const product = catalogModel.getSelectedCard();
    if (!product) return;

    const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    if (!previewTemplate) throw new Error('Template #card-preview not found');
    const previewElement = previewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!previewElement) throw new Error('Failed to clone preview card');
    const previewCard = new PreviewCard(previewElement, {
        onClick: () => {
            if (cartModel.hasItem(product.id)) {
                cartModel.removeItem(product.id);
            } else {
                cartModel.addItem(product);
            }
            previewCard.buttonState = cartModel.hasItem(product.id);
        }
    });

    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.image = CDN_URL + product.image;
    previewCard.category = product.category;
    previewCard.description = product.description;
    previewCard.buttonState = cartModel.hasItem(product.id);

    modal.content = previewCard.render();
    modal.open();
});

// Корзина изменилась – обновляем список и счётчик
events.on('cart:changed', () => {
    const items = cartModel.getItems();
    page.counter = items.length;

    const basketItems = items.map((item, index) => {
        const basketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        if (!basketTemplate) throw new Error('Template #card-basket not found');
        const basketCardElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!basketCardElement) throw new Error('Failed to clone basket card');
        const card = new BasketCard(basketCardElement, { onClick: () => cartModel.removeItem(item.id) });
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return card.render();
    });
    basket.items = basketItems;
    basket.total = cartModel.getTotalPrice();
    basket.disabled = items.length === 0;
});

// Данные покупателя изменились – синхронизируем поля форм
events.on('buyer:changed', () => {
    const data = buyerModel.getData();
    orderForm.address = data.address;
    orderForm.payment = data.payment; 
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    updateFormValidity();
});

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ
// ============================================

// Клик по карточке в каталоге
events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getProduct(data.id);
    catalogModel.setSelectedCard(product ?? null);
});

// Открытие корзины (клик по иконке корзины на странице)
events.on('basket:open', () => {
    modal.content = basket.render();
    currentForm = null;
    modal.open();
});

// Переход к оформлению заказа (кнопка в корзине)
events.on('basket:order', () => {
    modal.content = orderForm.render();
    currentForm = 'order';
    updateFormValidity();
    modal.open();
});

// Изменение способа оплаты в форме заказа
events.on('order:paymentChange', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.setData({ payment: data.payment });
});

// Изменение полей в формах
events.on('form:change', (data: { field: string; value: string }) => {
    if (currentForm === 'order') {
        if (data.field === 'address') buyerModel.setData({ address: data.value });
    } else if (currentForm === 'contacts') {
        if (data.field === 'email') buyerModel.setData({ email: data.value });
        if (data.field === 'phone') buyerModel.setData({ phone: data.value });
    }
    updateFormValidity();
});

// Отправка первой формы (заказ) – переход к контактам
events.on('order:submit', () => {
    modal.content = contactsForm.render();
    currentForm = 'contacts';
    updateFormValidity();
    modal.open();
});

// Отправка второй формы (контакты) – финальная отправка заказа
events.on('contacts:submit', async () => {
    const order: IOrder = {
        ...buyerModel.getData(),
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotalPrice()
    };
    try {
        const result = await larekApi.sendOrder(order);
        cartModel.clearCart();
        buyerModel.clearData();
        success.total = result.total;
        modal.content = success.render();
    } catch (err) {
        console.error('Ошибка отправки заказа:', err);
        // Здесь можно показать сообщение об ошибке в форме
    }
});

events.on('modal:close', () => {
    currentForm = null;
});

// ============================================
// ЗАПУСК: загружаем товары с сервера
// ============================================
larekApi.getProductList()
    .then(products => {
        console.log('1. Товары успешно загружены с сервера:', products);
        catalogModel.setProducts(products);
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
    });