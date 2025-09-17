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
    <div class="tabs">
      <div
        *ngFor="let tab of tabService.tabs(); let i = index"
        class="tab"
        [class.active]="i === tabService.currentIndex()"
        (click)="selectTab(tab.path, i)"
      >
        {{ tab.title }}
        <span class="close" (click)="closeTab(i, $event)">×</span>
      </div>
    </div>
  `,
  styles: [
    `
      .tabs {
        display: flex;
        border-bottom: 1px solid #ccc;
        background: #fafafa;
      }
      .tab {
        padding: 6px 12px;
        cursor: pointer;
        position: relative;
      }
      .tab.active {
        background: #fff;
        border: 1px solid #ccc;
        border-bottom: none;
      }
      .close {
        margin-left: 8px;
        color: red;
        cursor: pointer;
      }
    `,
  ],
})
export class TabsComponent {
  tabService = inject(TabService);

  selectTab(path: string, index: number) {
    this.tabService.currentIndex.set(index);
    this.tabService.router.navigateByUrl(path);
  }

  closeTab(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.tabService.removeTab(index);
  }
}
