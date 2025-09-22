// tab.model.ts
import { ActivatedRouteSnapshot } from '@angular/router';

export interface TabModel {
  title: string;
  path: string;
  key: string;  // key dùng cho reuse strategy
  // snapshotArray: ActivatedRouteSnapshot[];
}
