import { ApiOrderRequest, IContactsFormData, IOrderFormData, IOrderModel } from "../../types";
import { EventEmitter, IEvents } from "../base/events";

export class OrderModel extends EventEmitter implements IOrderModel {
  constructor(protected events: IEvents) {
    super();
  }
  orderData: IOrderFormData = {
    payment: '' as 'cash' | 'card' | '',
    address: ''
  }

  contactsData: IContactsFormData = {
    email: '',
    phone: ''
  }

  protected _errors: Partial<Record<keyof IOrderModel, string>> = {};

  get payment(): 'cash' | 'card' | '' {
        return this.orderData.payment;
    }

  get address(): string {
      return this.orderData.address;
  }

  get email(): string {
      return this.contactsData.email;
  }

  get phone(): string {
      return this.contactsData.phone;
  }

  setOrderDataField(field: keyof IOrderFormData, value: string): void {
    if (field === 'payment') {
      this.orderData[field] = value as 'cash' | 'card';
    } else {
      this.orderData[field] = value;
    }
    this.validateField(field);
    this.events.emit('order:changed');
  }

  setContactsDataField(field: keyof IContactsFormData, value: string): void {
    this.contactsData[field] = value;
    this.validateField(field);
    this.events.emit('contacts:changed')
  }

  protected validateField(field: keyof IOrderModel) {
    switch (field) {
      case 'payment':
        this._errors.payment = !this.orderData.payment ? 'Необходимо выбрать способ оплаты' : '';
        break;
      case 'address':
        this._errors.address = !this.orderData.address ? 'Необходимо указать адрес' : '';
        break;
      case 'email':
        this._errors.email = !this.contactsData.email ? 'Необходимо указать email' : 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactsData.email) ? 'Некорректный email' : '';
        break;
      case 'phone':
        this._errors.phone = !this.contactsData.phone ? 'Необходимо указать телефон' :
        !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(this.contactsData.phone) ? 'Некорректный телефон' :  '';
        break;
    }
  }

  validateForm(): boolean {
    this.validateField('payment');
    this.validateField('address');
    this.validateField('email');
    this.validateField('phone');

    const isValid = Object.values(this._errors).every(error => !error);
    this.emit('order:validation', { isValid, errors: this._errors });
    return isValid;
  }

  getErrors(): Partial<Record<keyof IOrderModel, string>> {
    return this._errors;
  }

  getOrderData(items: string[], total: number): ApiOrderRequest {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: total,
            items: items
        };
    }

  checkOrderData(): boolean {
    return this.orderData.payment !== '' && this.orderData.address.trim() !== '';
  }

  checkContactsData(): boolean {
    return this._errors.email == '' && this._errors.phone == '';
  }

  clear(): void {
    this.orderData.payment = '';
    this.orderData.address = '';
    this.contactsData.email = '';
    this.contactsData.phone = '';
    this._errors = {};
  }
}