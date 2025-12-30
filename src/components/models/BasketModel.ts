import { IBasketItem, IBasketModel, IProduct } from "../../types";
import { EventEmitter, IEvents } from "../base/events"

export class BasketModel extends EventEmitter implements IBasketModel {
  protected _products: IBasketItem[]= [];

  constructor(protected events: IEvents) {
    super()
  }

  get products(): IBasketItem[] {
    return this._products;
  }

  get counter(): number {
    return this._products.length;
  }

  get totalSum(): number {
    return this._products.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  addToCart(product: IProduct): void {
    const existingIndex = this.products.findIndex(item => item.id === product.id);

    if (existingIndex >= 0) {
      this._products.splice(existingIndex, 1);
    }
    else {
      this._products.push({
        id: product.id,
        title: product.title,
        price: product.price
      })
    }
    this.events.emit('basket:changed');
  }

  removeFromCart(productId: string): void {
    this._products = this._products.filter(item => item.id !== productId);
    this.events.emit('basket:changed');
  }

  clear(): void {
    this._products = [];
    this.events.emit('basket:changed');
  }

  isInCart(productId: string): boolean {
    return this._products.some(item => item.id === productId);
  }
}