import { IActions, ICardView, IProduct, TCategory } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

const categoryMap: Record<string, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button'
};

export class CardView extends Component<ICardView> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: IActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._description = container.querySelector(`.${blockName}__description`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container); 
    this._button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) { 
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      }
      else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
    this.setImage(this._image, CDN_URL + value, this.title)
  }

  set price(value: string) {
    this.setText(this._price, value);
  }

  set category(value: TCategory) {
      this.setText(this._category, value);
      const categoryKey = categoryMap[value.toLowerCase()];
      this._category.className = `card__category card__category_${categoryKey}`;

  }

  set description(value: string) {
      this.setText(this._description, value);
  }

  set button(value: string) {
      this.setText(this._button, value);
      if (this._price.textContent == 'Бесценно') {
      this.setDisabled(this._button, true);
      this._button.textContent = 'Недоступно';
    }
  }
}