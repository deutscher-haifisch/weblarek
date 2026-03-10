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
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { CatalogGallery } from './components/View/CatalogGallery';
import { BasketCounter } from './components/View/BasketCounter';

// Константы и типы
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder } from './types/index';
import { ensureElement } from './utils/utils';
import { cloneTemplate } from './utils/utils';

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

const events = new EventEmitter();
const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
const larekApi = new LarekApi(api);

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Модальное окно (есть в статическом DOM)
const modalElement = ensureElement<HTMLElement>('.modal');
const modal = new Modal(modalElement, events);

// Корзина (из шаблона)
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basket = new Basket(basketElement, events);

// Форма заказа (из шаблона)
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderElement = cloneTemplate<HTMLFormElement>(orderTemplate);
const orderForm = new OrderForm(orderElement, events);

// Форма контактов (из шаблона)
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactsElement = cloneTemplate<HTMLFormElement>(contactsTemplate);
const contactsForm = new ContactsForm(contactsElement, events);

// Сообщение об успехе (из шаблона)
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successElement = cloneTemplate<HTMLElement>(successTemplate);
const success = new Success(successElement, { onClick: () => modal.close() });

// Кнопка корзины в шапке (есть в статическом DOM)
const basketButton = ensureElement<HTMLElement>('.header__basket');
basketButton.addEventListener('click', () => events.emit('basket:open'));

// Галерея товаров (есть в статическом DOM)
const galleryElement = ensureElement<HTMLElement>('.gallery');
const gallery = new CatalogGallery(galleryElement);

// Счётчик корзины в шапке (есть в статическом DOM)
const basketCounterElement = ensureElement<HTMLElement>('.header__basket-counter');
const basketCounter = new BasketCounter(basketCounterElement);

// Шаблоны для карточек (используются для создания карточек товаров)
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
let currentProductId: string | null = null;

const previewCard = new PreviewCard(
    cloneTemplate(previewTemplate),
    {
        onClick: () => {
            if (currentProductId) {
                events.emit('card:toggle', { id: currentProductId });
            }
        }
    }
);

// Вспомогательная функция для обновления валидации текущей формы
function updateFormValidity() {
    const errors = buyerModel.validate();
    const step = buyerModel.getStep();
    
    if (step === 'order') {
        // Проверка валидности формы (все поля должны быть без ошибок)
        orderForm.valid = !errors.payment && !errors.address;
        
        // Собираем все ошибки
        const errorMessages = [];
        if (errors.payment) errorMessages.push(errors.payment);
        if (errors.address) errorMessages.push(errors.address);
        orderForm.errors = errorMessages.join('; ');
        
    } else if (step === 'contacts') {
        contactsForm.valid = !errors.email && !errors.phone;
        
        const errorMessages = [];
        if (errors.email) errorMessages.push(errors.email);
        if (errors.phone) errorMessages.push(errors.phone);
        contactsForm.errors = errorMessages.join('; ');
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
        const cardElement = cloneTemplate<HTMLElement>(catalogTemplate);
        const card = new CatalogCard(cardElement, { onClick: () => events.emit('card:select', { id: item.id }) });
        card.title = item.title;
        card.price = item.price;
        card.image = CDN_URL + item.image;
        card.category = item.category;
        return card.render();
    });
    gallery.items = cardElements;
    console.log('Descriptions:', products.map(p => p.description));
});

// Выбран новый товар – открываем модалку с превью
events.on('card:selected', () => {
    const product = catalogModel.getSelectedCard();
    if (!product) return;

    currentProductId = product.id;

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
    basketCounter.value = items.length;

    const basketItems = items.map((item, index) => {
        const basketCardElement = cloneTemplate<HTMLElement>(basketCardTemplate);
        const card = new BasketCard(basketCardElement, { onClick: () => events.emit('basket:remove', { id: item.id }) });
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return card.render();
    });
    basket.items = basketItems;
    basket.total = cartModel.getTotalPrice();
    basket.disabled = items.length === 0;

        const product = catalogModel.getSelectedCard();
        if (product) {
            previewCard.buttonState = cartModel.hasItem(product.id);
        }
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

events.on('card:toggle', (data: { id: string }) => {
    const product = catalogModel.getProduct(data.id);
    if (!product) return;
    if (cartModel.hasItem(product.id)) {
        cartModel.removeItem(product.id);
    } else {
        cartModel.addItem(product);
    }
});

// Открытие корзины (клик по иконке корзины на странице)
events.on('basket:open', () => {
    modal.content = basket.render();
    buyerModel.setStep(null);
    modal.open();
});

// Переход к оформлению заказа (кнопка в корзине)
events.on('basket:order', () => {
    modal.content = orderForm.render();
    buyerModel.setStep('order');
    updateFormValidity();
    modal.open();
});

events.on('basket:remove', (data: { id: string }) => {
    cartModel.removeItem(data.id);
});

// Изменение способа оплаты в форме заказа
events.on('order:paymentChange', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.setData({ payment: data.payment });
});

// Изменение полей в формах
events.on('form:change', (data: { field: string; value: string }) => {
    const step = buyerModel.getStep();
    if (step === 'order') {
        if (data.field === 'address') buyerModel.setData({ address: data.value });
    } else if (step === 'contacts') {
        if (data.field === 'email') buyerModel.setData({ email: data.value });
        if (data.field === 'phone') buyerModel.setData({ phone: data.value });
    }
});

// Отправка первой формы (заказ) – переход к контактам
events.on('order:submit', () => {
    modal.content = contactsForm.render();
    buyerModel.setStep('contacts');
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
    }
});

events.on('modal:close', () => {
    currentProductId = null;
    buyerModel.setStep(null);
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