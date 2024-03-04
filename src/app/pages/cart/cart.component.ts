import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { BASE_URL } from 'src/app/constants/urls';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  cart: Cart = {
    items: [
      {
        product: 'https://placehold.co/150',
        name: 'snickers',
        price: 150,
        quantity: 1,
        id: 1
      },
      {
        product: 'https://placehold.co/150',
        name: 'speed',
        price: 100,
        quantity: 2,
        id: 2
      },
    ]
  };

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout() {
    // this.http.post('http://localhost:4242/checkout', {
    this.http.post(`${BASE_URL}/checkout`, {
      items: this.cart.items
    }).subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51OqJ2dFqCl4i3LlWH3YgTRoJHdvkk7ds4r8jMQrdgXXjLEJ5jhw9Xq367aVDfKEGvmr0edWyIIWZR7cYH8RrHoun00mB8ceTDf');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}
