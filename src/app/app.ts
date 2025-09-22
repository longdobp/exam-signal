import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabComponent } from './tabs.component';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-root',
  imports: [TabComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('exam-signal');
}
