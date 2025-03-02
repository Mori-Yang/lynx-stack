// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
export function isDirectOrDeepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  if (
    typeof a == 'object' && a !== null && typeof b == 'object' && b !== null && JSON.stringify(a) === JSON.stringify(b)
  ) {
    return true;
  }
  return false;
}

export function isEmptyObject(obj?: object): obj is Record<string, never> {
  for (var _ in obj) return false;
  return true;
}

export function isSdkVersionGt(major: number, minor: number): boolean {
  const lynxSdkVersion: string = SystemInfo.lynxSdkVersion || '1.0';
  const version = lynxSdkVersion.split('.');
  return Number(version[0]) > major || (Number(version[0]) == major && Number(version[1]) > minor);
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: Iterable<K>): Pick<T, K> {
  const result: any = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
