import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class ModalView extends Component<{ content: HTMLElement}> {

  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value)
  }

  open(): void {
    this.toggleClass(this.container, 'modal_active', true);
    this.events.emit('modal:open');
  }

  close(): void {
    this.toggleClass(this.container, 'modal_active', false);
    this.content = null;
    this.events.emit('modal:close');
  }

}