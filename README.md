# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные и модели данных

### Интерфейсы данных

В проекте есть два основных типа данных, которые мы будем использовать:

Товар (IProduct) - то, что продается в магазине

interface IProduct {
  id: string;        // айди товара, уникальный
  title: string;     // название
  image: string;     // картинка
  category: string;  // категория (софт-скил, хард-скил и тд)
  price: number | null; // цена, null значит "бесценный" (не продается)
  description: string; // описание
}


Покупатель (IBuyer) - кто покупает

type TPayment = 'card' | 'cash' | ''; // способ оплаты

interface IBuyer {
  payment: TPayment;  // оплата картой/налом
  address: string;    // адрес доставки
  email: string;      // почта
  phone: string;      // телефон
}
Модели данных
У нас будет три класса, каждый отвечает за свою часть данных.

1. Класс CatalogModel (каталог товаров)
Хранит все товары и то, что выбрали для просмотра.


class CatalogModel {
  private _products: IProduct[] = [];        // все товары
  private _selectedCard: IProduct | null = null; // выбранный товар

  constructor() {
    // просто создаем пустой каталог
  }

  // сохранить товары с сервера
  setProducts(products: IProduct[]): void {
    this._products = products;
  }

  // получить все товары
  getProducts(): IProduct[] {
    return this._products;
  }

  // найти товар по id
  getProduct(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  // запомнить какой товар открыли
  setSelectedCard(product: IProduct): void {
    this._selectedCard = product;
  }

  // получить открытый товар
  getSelectedCard(): IProduct | null {
    return this._selectedCard;
  }
}
Что тут происходит:

_products - массив всех товаров с сервера

_selectedCard - товар, который сейчас смотрим в модалке

методы просто получают/сохраняют данные

2. Класс CartModel (корзина)
Здесь товары которые добавили в корзину.

class CartModel {
  private _items: IProduct[] = []; // товары в корзине

  constructor() {}

  // что лежит в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // добавить товар
  addItem(product: IProduct): void {
    // проверяем, есть ли уже такой и можно ли купить
    if (product.price === null) {
      console.log('бесценный товар нельзя добавить');
      return;
    }
    if (!this.hasItem(product.id)) {
      this._items.push(product);
    }
  }

  // удалить товар
  removeItem(productId: string): void {
    this._items = this._items.filter(item => item.id !== productId);
  }

  // очистить всю корзину
  clearCart(): void {
    this._items = [];
  }

  // общая сумма
  getTotalPrice(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  // сколько товаров
  getItemCount(): number {
    return this._items.length;
  }

  // проверка есть ли товар в корзине
  hasItem(productId: string): boolean {
    return this._items.some(item => item.id === productId);
  }
}
Что тут важно:

бесценные товары (price = null) нельзя добавить в корзину

сумма считается через reduce

hasItem нужен чтобы не добавлять одно и то же два раза

3. Класс BuyerModel (покупатель)
Данные для доставки и оплаты.

// типы для ошибок валидации
interface IBuyerErrors {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
}

class BuyerModel {
  private _payment: TPayment = '';
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  constructor() {}

  // обновить данные (можно частично)
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
  }

  // получить все данные
  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone
    };
  }

  // очистить форму
  clearData(): void {
    this._payment = '';
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  // проверка заполненности полей
  validate(): IBuyerErrors {
    const errors: IBuyerErrors = {};

    if (!this._payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    if (!this._address.trim()) {
      errors.address = 'Введите адрес доставки';
    }
    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }
    if (!this._phone.trim()) {
      errors.phone = 'Введите номер телефона';
    }

    return errors;
  }
}
Валидация:
Проверка на пустые строки. Метод возвращает объект только с ошибками, если поле заполнено - его нет в объекте.

Partial<IBuyer> - тип из TypeScript, позволяет передать не все поля, а только те которые хотим изменить.

Как это все работает вместе
Модели независимые, каждая занимается своим:

CatalogModel - товары в магазине

CartModel - что выбрал пользователь

BuyerModel - данные покупателя

// Пример использования:
const catalog = new CatalogModel();
catalog.setProducts(productsFromServer);
const product = catalog.getProduct('123');

const cart = new CartModel();
cart.addItem(product);
console.log(cart.getTotalPrice()); // сумма

const buyer = new BuyerModel();
buyer.setData({ address: 'ул. Ленина, 1', payment: 'card' });
const errors = buyer.validate();
if (Object.keys(errors).length === 0) {
  // можно оформлять заказ
}

## Слой коммуникации

### Класс LarekApi

Отвечает за запросы к серверу. Использует базовый класс Api.

Конструктор:

constructor(api: IApi) {
    this._api = api;
}
Поля:

_api: IApi — экземпляр Api для запросов

Методы:

Метод	Параметры	Возвращает	Описание
getProductList	—	Promise<IProduct[]>	GET запрос на /product/, получает товары
sendOrder	order: IOrder	Promise<IOrderResult | null>	POST запрос на /order/, отправляет заказ
Интерфейсы для сервера

// Ответ сервера со списком товаров
interface IProductsResponse {
    items: IProduct[];
}

// Данные для отправки заказа
interface IOrder {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
    items: string[];  // id товаров
    total: number;    // общая сумма
}

// Ответ сервера после заказа
interface IOrderResult {
    id: string;      // номер заказа
    total: number;   // итоговая сумма
}