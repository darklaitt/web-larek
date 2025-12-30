import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { ProductModel} from './components/models/ProductModel';
import { BasketItemView } from './components/views/BasketItemView';
import { BasketView } from './components/views/BasketView';
import { CardView } from './components/views/CardView';
import { ContactsFormView } from './components/views/ContactsFormView';
import { ModalView } from './components/views/ModalView';
import { OrderFormView } from './components/views/OrderFormView';
import { PageView } from './components/views/PageView';
import { SuccessView } from './components/views/SuccessView';
import './scss/styles.scss';
import { ApiOrderResponse, ApiProductList, IProduct } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);

const page = new PageView(document.body, events);

const productModel = new ProductModel();
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const modal = new ModalView(modalContainer, events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderFormView(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsFormView(cloneTemplate(contactsFormTemplate), events)

api.get('/product')
    .then((data: ApiProductList) => {
      productModel.products = data.items;
      events.emit('products:changed');
    })
    .catch(err => {
      console.error('Ошибка загрузки товаров: ', err);
    })
    
events.on('products:changed', () => {
  page.catalog = productModel.products.map(product => {
    const card = new CardView('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', product)
    });
    return card.render({
      id: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      price: product.formattedPrice
    })
  })
})

events.on('card:select', (product: IProduct) => {
  const card = new CardView('card', cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (product.price !== null) {
        basketModel.addToCart(product);
        modal.close();
      }
    }
  });

  const isInCart = basketModel.isInCart(product.id);

  const cardElement = card.render({
    id: product.id,
    title: product.title,
    image: product.image,
    category: product.category,
    price: product.formattedPrice,
    description: product.description,
    button: isInCart ? 'Убрать из корзины' : 'В корзину'
  });

  modal.render({
    content: cardElement
  });
  
  modal.open();

})

events.on('basket:changed', () => {
  page.counter = basketModel.counter;
})

events.on('basket:open', () => {
  basket.products = basketModel.products.map((item, index) => {
    const basketItem = new BasketItemView(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        basketModel.removeFromCart(item.id)
        events.emit('basket:open');
      }
    });
    return basketItem.render({
      id: index+1,
      title: item.title,
      price: `${item.price} синапсов`
    })
  })

  basket.totalSum = basketModel.totalSum;
  modal.content = basket.containerElement;
  modal.open();
})

events.on('order:open', () => {
  orderModel.clear();
  orderForm.setPaymentMethod('' as 'cash' | 'card');
  orderForm.openButton(false);
  modal.render({
    content: orderForm.render({
      payment: '',
      address: '',
    })
  })
})

events.on('order.payment:changed', (data: { value: string }) => {
  orderModel.setOrderDataField('payment', data.value);
  orderForm.setPaymentMethod(data.value as 'cash' | 'card');
});

events.on('order.address:changed', (data: { value: string }) => {
  orderModel.setOrderDataField('address', data.value);
});

events.on('order:changed', () => {
  const isValid = orderModel.checkOrderData()
  orderForm.openButton(isValid);
  if (!isValid) {
    const errors = orderModel.getErrors();
    orderForm.error = errors.payment || errors.address
  }
  else {
    orderForm.error = '';
  }
})

events.on('contacts:open', () => {
  contactsForm.clear();
  contactsForm.openButton(false);
  modal.render({
    content: contactsForm.render({
      email: '',
      phone: ''
    })
  })
})

events.on('contacts.email:changed', (data: { value: string }) => {
  orderModel.setContactsDataField('email', data.value);
});

events.on('contacts.phone:changed', (data: { value: string }) => {
  orderModel.setContactsDataField('phone', data.value);
});

events.on('contacts:changed', () => {
  const isValid = orderModel.checkContactsData()
  contactsForm.openButton(isValid);
  if (!isValid) {
    const errors = orderModel.getErrors();
    contactsForm.error = errors.email || errors.phone
  }
  else {
    contactsForm.error = '';
  }
})

events.on('contacts:submit', () => {
  const orderData = orderModel.getOrderData(
      basketModel.products.map(item => item.id),
      basketModel.totalSum
  );

  api.post('/order', orderData)
      .then((result: ApiOrderResponse) => {
          const success = new SuccessView(cloneTemplate(successTemplate), {
              onClick: () => {
                  modal.close();
                  basketModel.clear();
                  orderModel.clear();
              }
          });

          modal.render({
              content: success.render({
                  total: result.total
              })
          });
      })
      .catch(err => {
          console.error('Ошибка оформления заказа:', err);
      });
});

events.on('modal:open', () => {
  page.locked = true;
})

events.on('modal:close', () => {
  page.locked = false;
})