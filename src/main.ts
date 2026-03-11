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

// Модальное окно
const modalElement = ensureElement<HTMLElement>('.modal');
const modal = new Modal(modalElement, events);

// Корзина (из шаблона)
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basket = new Basket(basketElement, events);

// Форма заказа
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderElement = cloneTemplate<HTMLFormElement>(orderTemplate);
const orderForm = new OrderForm(orderElement, events);

// Форма контактов
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactsElement = cloneTemplate<HTMLFormElement>(contactsTemplate);
const contactsForm = new ContactsForm(contactsElement, events);

// Сообщение об успехе
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successElement = cloneTemplate<HTMLElement>(successTemplate);
const success = new Success(successElement, { onClick: () => modal.close() });

// Галерея
const galleryElement = ensureElement<HTMLElement>('.gallery');
const gallery = new CatalogGallery(galleryElement);

// Счётчик корзины
const basketButton = ensureElement<HTMLElement>('.header__basket');
const basketCounter = new BasketCounter(basketButton, events);

// Шаблоны карточек
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

let currentForm: 'order' | 'contacts' | null = null;

const previewCard = new PreviewCard(
    cloneTemplate(previewTemplate),
    {
        onClick: () => events.emit('card:toggle')
    }
);

function updateFormValidity() {
    const errors = buyerModel.validate();
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = [errors.payment, errors.address].filter(Boolean).join('; ');
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join('; ');
}


// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ
// ============================================

// Каталог изменился
events.on('catalog:changed', () => {
    const products = catalogModel.getProducts();
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
});

// Выбран товар
events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getProduct(data.id);
    catalogModel.setSelectedCard(product ?? null);
});

events.on('card:selected', () => {
    const product = catalogModel.getSelectedCard();
    if (!product) return;

    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.image = CDN_URL + product.image;
    previewCard.category = product.category;
    previewCard.description = product.description;
    previewCard.buttonState = cartModel.hasItem(product.id);

    modal.content = previewCard.render();
    modal.open();
});

// Переключение товара в корзине (добавить/удалить)
events.on('card:toggle', () => {
    const product = catalogModel.getSelectedCard();
    if (!product) return;

    if (cartModel.hasItem(product.id)) {
        cartModel.removeItem(product.id);
    } else {
        cartModel.addItem(product);
    }
});

// Корзина изменилась
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

    // Обновляем кнопку в превью, если открыто
    const product = catalogModel.getSelectedCard();
    if (product) {
        previewCard.buttonState = cartModel.hasItem(product.id);
    }
});

// Покупатель изменился
events.on('buyer:changed', () => {
    const data = buyerModel.getData();
    orderForm.address = data.address;
    orderForm.payment = data.payment;
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    updateFormValidity();
});

// Открытие корзины
events.on('basket:open', () => {
    modal.content = basket.render();
    currentForm = null;
    modal.open();
});

// Переход к заказу
events.on('basket:order', () => {
    modal.content = orderForm.render();
    currentForm = 'order';
    updateFormValidity();
    modal.open();
});

// Удаление из корзины
events.on('basket:remove', (data: { id: string }) => {
    cartModel.removeItem(data.id);
});

// Изменение способа оплаты
events.on('order:paymentChange', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.setData({ payment: data.payment });
});

// Изменение полей форм
events.on('form:change', (data: { field: string; value: string }) => {
    if (currentForm === 'order') {
        if (data.field === 'address') buyerModel.setData({ address: data.value });
    } else if (currentForm === 'contacts') {
        if (data.field === 'email') buyerModel.setData({ email: data.value });
        if (data.field === 'phone') buyerModel.setData({ phone: data.value });
    }
});

// Отправка первой формы
events.on('order:submit', () => {
    modal.content = contactsForm.render();
    currentForm = 'contacts';
    updateFormValidity();
    modal.open();
});

// Отправка второй формы
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
        currentForm = null;
        success.total = result.total;
        modal.content = success.render();
    } catch (err) {
        console.error('Ошибка отправки заказа:', err);
    }
});

// ============================================
// ЗАПУСК: загружаем товары с сервера
// ============================================

larekApi.getProductList()
    .then(products => {
        catalogModel.setProducts(products);
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
    });