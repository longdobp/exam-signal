import { Injectable, signal, computed, Type } from '@angular/core';

export interface Tab {
  id: string;
  title: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class TabService {
  tabs = signal<Tab[]>([]);
  selectedIndex = signal(0);

  activeTab = computed(() => this.tabs()[this.selectedIndex()] ?? null);

  openTab(newTab: Tab) {
    const existingIndex = this.tabs().findIndex(t => t.id === newTab.id);

    if (existingIndex > -1) {
      this.selectedIndex.set(existingIndex);
    } else {
      this.tabs.update(list => [...list, newTab]);
      this.selectedIndex.set(this.tabs().length - 1);
    }
  }

  closeTab(id: string) {
    const currentTabs = this.tabs();
    const idx = currentTabs.findIndex(t => t.id === id);

    if (idx > -1) {
      const newTabs = currentTabs.filter(t => t.id !== id);
      this.tabs.set(newTabs);

      if (this.selectedIndex() >= newTabs.length) {
        this.selectedIndex.set(newTabs.length - 1);
      }
    }
  }

  selectTab(index: number) {
    this.selectedIndex.set(index);
  }
}
