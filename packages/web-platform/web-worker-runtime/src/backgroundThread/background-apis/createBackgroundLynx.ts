// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { Cloneable, NativeApp } from '@lynx-js/web-constants';
import type { Rpc } from '@lynx-js/web-worker-rpc';
import { createGetCustomSection } from './crossThreadHandlers/createGetCustomSection.js';

export interface CreateLynxConfig {
  globalProps: unknown;
  customSections: Record<string, Cloneable>;
}

export function createBackgroundLynx(
  config: CreateLynxConfig,
  nativeApp: NativeApp,
  mainThreadRpc: Rpc,
) {
  return {
    __globalProps: config.globalProps,
    getJSModule(_moduleName: string): any {
    },
    getNativeApp(): NativeApp {
      return nativeApp;
    },
    getCoreContext() {
      return {
        addInternalEventListener() {},
        addEventListener() {},
      } as any;
    },
    getCustomSectionSync(key: string) {
      return config.customSections[key];
    },
    getCustomSection: createGetCustomSection(
      mainThreadRpc,
      config.customSections,
    ),
  };
}
