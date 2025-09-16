import {
  computed,
  Directive,
  HostBinding,
  HostListener,
  input,
  signal,
} from '@angular/core';

// TODO: Import input, signal, and computed from @angular/core

@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'backgroundStyle()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  // TODO: Create signal input for color with default 'yellow'
  color = input<string>('yellow');

  // TODO: Create signal input for intensity with default 0.3
  intensity = input<number>(0.3);

  // TODO: Create internal signal for hover state (private isHovered)
  private isHovered = signal(false);

  // TODO: Create computed signal for background style
  backgroundStyle = computed(() => {
    const baseColor = this.color();
    const alpha = this.isHovered() ? this.intensity() : this.intensity() * 0.5;

    const colorMap: Record<string, string> = {
      'yellow': `rgba(255, 255, 0, ${alpha})`,
      'blue': `rgba(0, 100, 255, ${alpha})`,
      'green': `rgba(0, 200, 0, ${alpha})`,
      'red': `rgba(255, 0, 0, ${alpha})`,
    };
    return colorMap[baseColor] || colorMap['yellow'];
  });

  @HostBinding('style.backgroundColor')
  get backgroundColor() {
    return this.backgroundStyle(); // TODO: Use computed signal
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    // TODO: Set isHovered to true
    this.isHovered.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    // TODO: Set isHovered to false
    this.isHovered.set(false);
  }
}
