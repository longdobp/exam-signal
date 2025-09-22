import { computed, DestroyRef, inject, DOCUMENT } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

// import { ScrollService } from '@core/services/common/scroll.service';
// import { ThemeService } from '@store/common-store/theme.service';
import { fnGetReuseStrategyKeyFn, getDeepReuseStrategyKeyFn } from './tools';

// import { NzSafeAny } from 'ng-zorro-antd/core/types';
export type NzSafeAny = any;

export type ReuseHookTypes = '_onReuseInit' | '_onReuseDestroy';

export interface ReuseComponentInstance {
  _onReuseInit: () => void;
  _onReuseDestroy: () => void;
}

export interface ReuseComponentRef {
  instance: ReuseComponentInstance;
}

export class SimpleReuseStrategy implements RouteReuseStrategy {
  destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  // private readonly scrollService = inject(ScrollService);

  static handlers: Record<string, NzSafeAny> = {};

  static scrollHandlers: Record<string, NzSafeAny> = {};

  public static waitDelete: string | null;
  // themesService = inject(ThemeService); 

  $isShowTab = computed(() => {
    return true; //this.themesService.$themesOptions().isShowTab;
  });

  public static deleteRouteSnapshot(key: string): void {
    if (SimpleReuseStrategy.handlers[key]) {
      if (SimpleReuseStrategy.handlers[key].componentRef) {
        SimpleReuseStrategy.handlers[key].componentRef.destroy();
      }
      delete SimpleReuseStrategy.handlers[key];
      delete SimpleReuseStrategy.scrollHandlers[key];
    }
  }

  public static deleteAllRouteSnapshot(route: ActivatedRouteSnapshot): Promise<void> {
    return new Promise(resolve => {
      Object.keys(SimpleReuseStrategy.handlers).forEach(key => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
      });
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(route);
      resolve();
    });
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['shouldDetach'] !== 'no' && this.$isShowTab();
  }

  store(route: ActivatedRouteSnapshot, handle: any): void {
    if (route.data['shouldDetach'] === 'no') {
      return;
    }
    const key = fnGetReuseStrategyKeyFn(route);
    if (SimpleReuseStrategy.waitDelete === key) {
      this.runHook('_onReuseDestroy', handle.componentRef);
      handle.componentRef.destroy();
      SimpleReuseStrategy.waitDelete = null;
      delete SimpleReuseStrategy.scrollHandlers[key];
      return;
    }

    // const innerScrollContainer = [];
    // if (route.data['needKeepScroll'] !== 'no') {
    //   const scrollContain = route.data['scrollContain'] ?? [];
    //   scrollContain.forEach((item: string) => {
    //     const el = this.doc.querySelector(item)!;
    //     if (el) {
    //       const position = this.scrollService.getScrollPosition(el);
    //       innerScrollContainer.push({ [item]: position });
    //     }
    //   });
    //   innerScrollContainer.push({ window: this.scrollService.getScrollPosition() });
    // }

    // SimpleReuseStrategy.scrollHandlers[key] = { scroll: innerScrollContainer };
    SimpleReuseStrategy.handlers[key] = handle;

    if (handle && handle.componentRef) {
      this.runHook('_onReuseDestroy', handle.componentRef);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = fnGetReuseStrategyKeyFn(route);
    return !!key && !!SimpleReuseStrategy.handlers[key];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = fnGetReuseStrategyKeyFn(route);
    return !key ? null : SimpleReuseStrategy.handlers[key];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const futureKey = fnGetReuseStrategyKeyFn(future);
    const currKey = fnGetReuseStrategyKeyFn(curr);
    if (!!futureKey && SimpleReuseStrategy.handlers[futureKey]) {
      this.runHook('_onReuseInit', SimpleReuseStrategy.handlers[futureKey].componentRef);
    }

    const result = futureKey === currKey;

    while (future.firstChild) {
      future = future.firstChild;
    }

    // const scrollFutureKey = fnGetReuseStrategyKeyFn(future);
    // if (!!scrollFutureKey && SimpleReuseStrategy.scrollHandlers[scrollFutureKey]) {
    //   SimpleReuseStrategy.scrollHandlers[scrollFutureKey].scroll.forEach((elOptionItem: Record<string, [number, number]>) => {
    //     Object.keys(elOptionItem).forEach(element => {
    //       setTimeout(() => {
    //         this.scrollService.scrollToPosition(this.doc.querySelector(element), elOptionItem[element]);
    //       }, 1);
    //     });
    //   });
    // }
    return result;
  }

  runHook(method: ReuseHookTypes, comp: ReuseComponentRef): void {
    if (comp == null || !comp.instance) {
      return;
    }
    const compThis = comp.instance;
    const fn = compThis[method];
    if (typeof fn !== 'function') {
      return;
    }
    (fn as () => void).call(compThis);
  }
}