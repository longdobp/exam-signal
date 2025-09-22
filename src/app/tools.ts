import { ActivatedRouteSnapshot } from '@angular/router';

const getDeepReuseStrategyKeyFn = function (
  route: ActivatedRouteSnapshot,
  needParams = true
): string {
  let temp = route;
  while (temp.firstChild) {
    temp = temp.firstChild;
  }
  return fnGetReuseStrategyKeyFn(temp, needParams);
};

const fnGetReuseStrategyKeyFn = function getKey(
  route: ActivatedRouteSnapshot,
  needParams = true
): string {
  const configKey = route.data['key'];
  if (!configKey) {
    return '';
  }
  if (!needParams) {
    return configKey;
  }

  if (Object.keys(route.queryParams).length > 0) {
    return configKey + JSON.stringify(route.queryParams);
  } else if (Object.keys(route.params).length > 0) {
    return configKey + JSON.stringify(route.params);
  } else {
    return `${configKey}{}`;
  }
};

const fnGetPathWithoutParam = function getPathWithoutParam(
  path: string
): string {
  const paramIndex = path.indexOf('?');
  if (paramIndex > -1) {
    return path.substring(0, paramIndex);
  }
  return path;
};

const fnStopMouseEvent = function stopMouseEvent(e: MouseEvent): void {
  if (!e) return;
  e.stopPropagation();
  e.preventDefault();
};

export {
  getDeepReuseStrategyKeyFn,
  fnGetReuseStrategyKeyFn,
  fnGetPathWithoutParam,
  fnStopMouseEvent,
};
