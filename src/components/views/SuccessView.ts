import { IActions, ISuccessView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class SuccessView extends Component<ISuccessView> {

  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IActions) {
    super(container);

    this._total = ensureElement<HTMLElement>('.order-success__description', container);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);
  
    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}