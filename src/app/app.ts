import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
  // computed,
  // linkedSignal,
  // resource,
} from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { loadUser } from './user-api';
// import { ProductCard } from './product-cart';
import { CustomCheckbox } from './custom-checkbox';
import { CartDisplay } from './cart-display';
import { CartStore } from './cart-store';

@Component({
  selector: 'app-root',
  imports: [CartDisplay],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('exam-signal');

  // TODO: Inject CartStore using inject(CartStore)
  cartStore = inject(CartStore);
}
