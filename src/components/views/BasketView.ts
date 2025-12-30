import { IBasketView } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class BasketView extends Component<IBasketView> {
  protected _totalSum: HTMLElement;
  protected _products: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._totalSum = ensureElement<HTMLElement>('.basket__price', container);
    this._products = ensureElement<HTMLElement>('.basket__list', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

    this.products = [];

    this._button.addEventListener('click', () => {
      events.emit('order:open');
    })
  }

  get containerElement() {
    return this.container;
  }
  
  set products(products: HTMLElement[]) {
    if (products.length) {
      this._products.replaceChildren(...products);
      this.setDisabled(this._button, false);
    }
    else {
      this._products.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста'
        })
      )
      this.setDisabled(this._button, true);
    }
  }

  set totalSum(totalSum: number) {
    this.setText(this._totalSum, `${totalSum} синапсов`)
  }
}