export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object): Promise<T>;
}

export interface ApiProduct {
  id: string;
  description?: string
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
  button: string;
}

export interface ApiOrderRequest {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface ApiOrderResponse {
    id: string;
    total: number;
}

export type TCategory = "другое" | "софт-скил" | "хард-скил" | "дополнительное" | "кнопка"

export interface ApiProductList {
  total: number;
  items: ApiProduct[]
}

export interface IProduct extends ApiProduct {
  formattedPrice: string;
  inCart: boolean;
}

export interface IBasketItem {
  id: string;
  title: string;
  price: number;
}

export interface IBasket {
  counter: number
  products: IBasketItem[]
  totalSum: number
}

export interface IBasketModel extends IBasket {
  addToCart(product: IProduct): void;
  removeFromCart(productId: string): void;
  clear(): void;
  isInCart(productId: string): boolean;
}

export interface IOrder {
  payment: 'cash' | 'card' | '';
  address: string;
  email: string;
  phone: string;
}

export interface IOrderFormData {
  payment: 'cash' | 'card' | '';
  address: string;
}

export interface IContactsFormData {
  email: string;
  phone: string;
}

export interface IOrderModel extends IOrder {
  validateForm(): boolean;
  getErrors(): Partial<Record<keyof IOrderModel, string>>
  clear(): void;
}

export interface ICardView {
    id: string;
    title: string;
    category: string;
    image: string;
    price: string;
    description?: string;
    button?: string;
}

export interface IOrderView {
  render(): void;
  onSubmit(handler: (orderData: IOrder) => void): void;
}

export interface IModalView {
  open(content: HTMLElement): void;
  close(): void;
}

export interface IBasketItemView {
  id: number
  title: string;
  price: string;
}

export interface IBasketView {
  products: HTMLElement[]
  totalSum: number
}

export interface ISuccessView {
  total: number;
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IPage {
  catalog: HTMLElement[];
  counter: number;
}