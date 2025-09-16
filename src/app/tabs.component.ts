// tabs.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TabService } from './tab.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex space-x-2 border-b mb-4">
      <button
        *ngFor="let tab of tabService.tabs(); let i = index"
        (click)="activateTab(i)"
        class="px-4 py-2 border-b-2"
        [class.border-blue-500]="tabService.selectedIndex() === i"
        [class.text-blue-500]="tabService.selectedIndex() === i"
      >
        {{ tab.title }}
        <span
          class="ml-2 text-red-500 cursor-pointer"
          (click)="closeTab(tab.id, $event)"
        >
          x
        </span>
      </button>
    </div>

    <div class="p-4 border rounded bg-gray-50">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class TabsComponent {
  tabService = inject(TabService);
  router = inject(Router);

  activateTab(index: number) {
    this.tabService.selectTab(index);
    const tab = this.tabService.activeTab();
    if (tab) {
      this.router.navigateByUrl(tab.route);
    }
  }

  closeTab(id: string, event: MouseEvent) {
    event.stopPropagation();
    const active = this.tabService.activeTab();
    this.tabService.closeTab(id);

    if (active?.id === id && this.tabService.activeTab()) {
      this.router.navigateByUrl(this.tabService.activeTab()!.route);
    }
  }
}
