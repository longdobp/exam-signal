// menu.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabService } from './tab.service';
import { Router } from '@angular/router';
import { TabModel } from './tab.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],

  template: `
    <ul class="menu">
      <li (click)="openTab('Trang chủ', '/home')">🏠 Trang chủ</li>
      <li (click)="openTab('Người dùng', '/users')">👤 Người dùng</li>
      <li (click)="openTab('Báo cáo', '/reports')">📊 Báo cáo</li>
    </ul>
  `,
  styles: [
    `
      .menu {
        list-style: none;
        padding: 0;
      }
      .menu li {
        cursor: pointer;
        padding: 8px 12px;
        border-bottom: 1px solid #ddd;
      }
      .menu li:hover {
        background: #f5f5f5;
      }
    `,
  ],
})
export class MenuComponent {
  private tabService = inject(TabService);

  openTab(title: string, path: string) {
    const tab: TabModel = { title, path, snapshotArray: [] };
    this.tabService.addTab(tab);
    this.tabService.router.navigateByUrl(path);
  }
}
