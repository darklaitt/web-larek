import { IContactsFormData } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class ContactsFormView extends Component<IContactsFormData> {

  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;
  protected _error: HTMLSpanElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);

    this._email = container.elements.namedItem('email') as HTMLInputElement;
    this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    this._error = container.querySelector<HTMLSpanElement>('.form__errors');
    this._button = container.querySelector<HTMLButtonElement>('.button');


    this._email.addEventListener('input', (input) => {
      events.emit('contacts.email:changed', { value: (input.target as HTMLInputElement).value});
    });

    this._phone.addEventListener('input', (input) => {
      events.emit('contacts.phone:changed', { value: (input.target as HTMLInputElement).value});
    });

    container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      events.emit('contacts:submit');
    })
  }

  openButton(value: boolean): void {
    this.setDisabled(this._button, !value);
  }

  set error(value: string) {
    this._error.textContent = value;
  }

  clear() {
    this._email.value = '';
    this._phone.value = '';
  }

}