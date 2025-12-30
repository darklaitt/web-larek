import { ApiProduct, IProduct } from "../../types";
import { EventEmitter } from "../base/events";

export class ProductModel extends EventEmitter {
  protected _products: IProduct[] = [];
  protected _cartProductIds: Set<string> = new Set();

  set products(products: ApiProduct[]) {
    this._products = products.map(product => this.transformProduct(product))
    this.emit('products:changed', { products: this.products})
  }

  get products(): IProduct[] {
    return this._products;
  }

  getProduct(id: string): IProduct {
    return this._products.find(product => product.id === id)
  } 

  transformProduct(apiProduct: ApiProduct): IProduct {
    return {
      ...apiProduct, 
      formattedPrice: apiProduct.price !== null ? `${apiProduct.price} синапсов` : 'Бесценно', 
      inCart: this._cartProductIds.has(apiProduct.id)
    }
  }
}