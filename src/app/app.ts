import { Component, computed, signal, viewChild } from '@angular/core';
import { ProductCard } from './product-card';
import { CartSummary } from './cart-summary';

@Component({
  selector: 'app-root',
  imports: [ProductCard, CartSummary],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('exam-signal');

  cartQuantity = signal(2);

  // TODO: Create viewChild queries to access child components
  firstProduct = viewChild(ProductCard);
  cartSummary = viewChild(CartSummary);

  totalPrice = computed(() => {
    return this.cartQuantity() * 999;
  });

  updateQuantity(change: number) {
    const newQuantity = this.cartQuantity() + change;
    if (newQuantity >= 0 && newQuantity <= 10) {
      this.cartQuantity.set(newQuantity);
    }
  }

  showFirstProductDetails() {
    // TODO: Get the first product using viewChild and call its highlight() method
    console.log('TODO: Implement show first product details');
    const product = this.firstProduct();
    if (product) {
      product.highlight();
    }
  }

  initiateCheckout() {
    // TODO: Get the cart summary using viewChild and call its initiateCheckout() method
    console.log('TODO: Implement initiate checkout');
    const summary = this.cartSummary();
    if (summary) {
      summary.initiateCheckout();
    }
  }
}
