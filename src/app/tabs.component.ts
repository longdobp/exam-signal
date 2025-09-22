import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { TabModel, TabService } from './tab.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { NzSafeAny } from './reuse-strategy';
import { fnStopMouseEvent } from './tools';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [AsyncPipe], // ✅ cần cho *ngFor, *ngIf
  template: `
    <!-- <ul class="nav nav-tabs">
      <li
        class="nav-item"
        *ngFor="let tab of tabService.tabs(); let i = index"
        [class.active]="i === tabService.currentIndex()"
      >
        <a class="nav-link" (click)="navigate(tab.path)">
          {{ tab.title }}
        </a>
        <button class="btn btn-sm btn-link text-danger" (click)="close(i)">×</button>
      </li>
    </ul> -->
    <ul class="nav nav-tabs">
      @for (tab of tabsSourceData$ | async; track trackByTab($index, tab); let i
      = $index; let length = $count) {
      <li class="nav-item">
        <a
          class="nav-link"
          [class.active]="i === currentIndex"
          (click)="goPage(tab)"
        >
          {{ tab.title }}
        </a>
        <button [disabled]="length - 1 === 0"
          class="btn btn-sm btn-link text-danger"
          (click)="closeTab(tab, $event, i)"
        >
          ×
        </button>
      </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent implements OnInit {
  private tabService = inject(TabService);
  // private nzContextMenuService = inject(NzContextMenuService);
  // private splitNavStoreService = inject(SplitNavStoreService);
  // private themesService = inject(ThemeService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  tabsSourceData: TabModel[] = [];
  tabsSourceData$ = this.tabService.getTabArray$();
  // $themesOptions = computed(() => this.themesService.$themesOptions());
  // $leftMenuArray = computed(() => this.splitNavStoreService.$splitLeftNavArray());
  // $isOverMode = computed(() => this.themesService.$isOverModeTheme());
  // $isCollapsed = computed(() => this.themesService.$isCollapsed());
  destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(filter((event: NzSafeAny) => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  get currentIndex(): number {
    return this.tabService.getCurrentTabIndex();
  }

  public trackByTab(index: number, tab: TabModel): string {
    return tab.title;
  }

  goPage(tab: TabModel): void {
    this.router.navigateByUrl(tab.path);
  }

  closeRithTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.tabService.delRightTab(tab.path, index);
  }

  closeLeftTab(tab: TabModel, e: MouseEvent, index: number): void {
    if (index === 0) {
      return;
    }
    fnStopMouseEvent(e);
    this.tabService.delLeftTab(tab.path, index);
  }

  closeOtherTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.tabService.delOtherTab(tab.path, index);
  }

  closeTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e);
    this.closeCurrentTab(tab, index);
  }

  clickCloseIcon( index: number ): void {
    console.log(this.tabsSourceData[index]);
    this.closeCurrentTab(this.tabsSourceData[index], index);
  }

  closeCurrentTab(tab: TabModel, index: number): void {
    if (this.tabsSourceData.length === 1) {
      return;
    }
    this.tabService.delTab(tab, index);

    this.cdr.detectChanges();
  }

  refresh(): void {
    this.tabService.refresh();
  }

  // contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
  //   this.nzContextMenuService.create($event, menu);
  // }

  // closeMenu(): void {
  //   this.nzContextMenuService.close();
  // }

  ngOnInit(): void {
    this.tabsSourceData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.tabsSourceData = res;
    });
  }
}
