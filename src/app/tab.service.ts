import { Injectable, signal, computed, Type, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabModel } from './tab.model';

export interface Tab {
  id: string;
  title: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class TabService {
  public router = inject(Router);
  private activeRoute = inject(ActivatedRoute);

  // signals
  readonly tabs = signal<TabModel[]>([]);
  readonly currentIndex = signal(0);

  addTab(tab: TabModel) {
    const exists = this.tabs().some((t) => t.path === tab.path);
    if (!exists) {
      this.tabs.update((tabs) => [...tabs, tab]);
    }
    this.currentIndex.set(this.findIndex(tab.path));
  }

  removeTab(index: number) {
    const tabs = this.tabs();
    if (tabs.length <= 1) return;

    const newTabs = tabs.filter((_, i) => i !== index);
    this.tabs.set(newTabs);

    let newIndex = this.currentIndex();
    if (index === this.currentIndex()) {
      newIndex = index > 0 ? index - 1 : 0;
      this.router.navigateByUrl(newTabs[newIndex].path);
    } else if (index < this.currentIndex()) {
      newIndex = this.currentIndex() - 1;
    }
    this.currentIndex.set(newIndex);
  }

  findIndex(path: string): number {
    const idx = this.tabs().findIndex((t) => t.path === path);
    this.currentIndex.set(idx);
    return idx;
  }
}
