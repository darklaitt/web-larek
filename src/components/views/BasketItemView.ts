import { IActions, IBasketItemView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class BasketItemView extends Component<IBasketItemView> {
  protected _id: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IActions) {
    super(container);

    this._id = ensureElement('.basket__item-index', container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set id(value: number) {
    this.setText(this._id, String(value))
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: string) {
    this.setText(this._price, value);
  }
}