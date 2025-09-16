import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { MenuComponent } from './menu.component';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, TabsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('exam-signal');
}
