import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TabService } from './tab.service';
import { filter, map, mergeMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'lodash';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" (click)="navigate('/home', 'Home')">Navbar</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" (click)="navigate('/home', 'Home')">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" (click)="navigate('/users', 'Users')">Users</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" (click)="navigate('/reports', 'Reports')"
              >Reports</a
            >
          </li>
        </ul>

        <form class="d-flex" role="search" (submit)="$event.preventDefault()">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav> `,
})
export class NavbarComponent {
  private tabService = inject(TabService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  routerPath = this.router.url;

  destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          this.routerPath = this.router.url;
          return this.activatedRoute;
        }),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => {
          return route.outlet === 'primary';
        }),
        mergeMap((route) => {
          return route.data;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((routeData) => {
        const isNewTabDetailPage = routeData['newTab'] === 'true';
        this.routeEndAction(isNewTabDetailPage);
      });
  }

  navigate(path: string, title: string) {
    // this.tabService.addTab({
    //   title,
    //   path,
    //   snapshotArray: [],
    // });
    this.router.navigate([path]);
  }

  private getTitle(route: ActivatedRoute): string {
    if (typeof route.snapshot.data['title'] === 'string') {
      return route.snapshot.data['title'];
    }
    if (typeof route.routeConfig?.title === 'string') {
      return route.routeConfig.title;
    }
    const url = route.snapshot.url.map((u) => u.path).join('/');
    return url ? url.charAt(0).toUpperCase() + url.slice(1) : 'Home';
  }

  routeEndAction(isNewTabDetailPage = false): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    let title = 'Ant Design';
    title = this.getTitle(route);
    this.tabService.addTab(
      {
        snapshotArray: [route.snapshot],
        title,
        path: this.routerPath,
      },
      isNewTabDetailPage
    );
    this.tabService.findIndex(this.routerPath);
  }

  ngOnInit(): void {
    this.routeEndAction();
  }
}
