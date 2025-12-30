import { IOrderFormData } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class OrderFormView extends Component<IOrderFormData> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _address: HTMLInputElement;
  protected _error: HTMLSpanElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);

    this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
    this._address = container.elements.namedItem('address') as HTMLInputElement;
    this._error = container.querySelector<HTMLSpanElement>('.form__errors');
    this._button = container.querySelector<HTMLButtonElement>('.order__button');

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.setPaymentMethod(button.name as 'cash' | 'card');
        events.emit('order.payment:changed', {value: button.name});
      })
    })

    this._address.addEventListener('input', (input) => {
      events.emit('order.address:changed', { value: (input.target as HTMLInputElement).value});
    });

    this._button.addEventListener('click', () => {
      events.emit('contacts:open');
    });
  }

  setPaymentMethod(method: 'cash' | 'card') {
    this._paymentButtons.forEach(button => {
      this.toggleClass(button, 'button_alt-active', button.name === method);
    })
  }

  openButton(value: boolean): void {
    if (value) {
      this.setDisabled(this._button, false);
    }
    else {
      this.setDisabled(this._button, true);
    }
  }

  set address(value: string) {
    this._address.value = value;
  }

  set error(value: string) {
    this._error.textContent = value;
  }
}