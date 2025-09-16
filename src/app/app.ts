import {
  Component,
  computed,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('exam-signal');

  theme = signal<'light' | 'dark'>('light');
  username = signal('Guest');
  isLoggedIn = signal(false);

  themeClass = computed(() => `theme-${this.theme()}`);

  constructor() {
    // TODO: Create effect to save theme to localStorage
    // Use localStorage.setItem('theme', this.theme()) and console.log
    effect(() => {
      localStorage.setItem('theme', this.theme());
      console.log(`Theme changed to: ${this.theme()}`);
    });
    // TODO: Create effect to log user activity changes
    // Read both isLoggedIn() and username() signals and console.log the status
    effect(() => {
      const status = this.isLoggedIn() ? 'logged in' : 'logged out';
      const user = this.username();
      console.log(`User ${user} is currently ${status}.`);
    });
    // TODO: Create effect with cleanup for timer
    // Use setInterval to log every 5 seconds, and onCleanup to clear the interval
    effect((onCleanup) => {
      const interval = setInterval(() => {
        console.log('Timer tick - Current theme:', this.theme());
      }, 5000);
      onCleanup(() => {
        clearInterval(interval);
        console.log('Timer cleaned up');
      });
    });
  }

  toggleTheme() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }

  login() {
    this.username.set('John Doe');
    this.isLoggedIn.set(true);
  }

  logout() {
    this.username.set('Guest');
    this.isLoggedIn.set(false);
  }
}
