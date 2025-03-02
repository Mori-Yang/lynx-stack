// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { Rpc } from '@lynx-js/web-worker-rpc';
import { createBackgroundLynx } from './createBackgroundLynx.js';
import { createNativeApp } from './createNativeApp.js';
import { registerDisposeHandler } from './crossThreadHandlers/registerDisposeHandler.js';
import { createMarkTimingInternal } from './crossThreadHandlers/createBackgroundMarkTimingInternal.js';
import { BackgroundThreadStartEndpoint } from '@lynx-js/web-constants';

const lynxCore = import(
  /* webpackMode: "eager" */ '@lynx-js/lynx-core/web'
);

export function startBackgroundThread(
  uiThreadPort: MessagePort,
  mainThreadPort: MessagePort,
): void {
  const uiThreadRpc = new Rpc(uiThreadPort, 'bg-to-ui');
  const mainThreadRpc = new Rpc(mainThreadPort, 'bg-to-main');
  const markTimingInternal = createMarkTimingInternal(uiThreadRpc);
  markTimingInternal('load_core_start');
  mainThreadRpc.registerHandler(
    BackgroundThreadStartEndpoint,
    async (config) => {
      markTimingInternal('load_core_end');
      const customNativeModules: Record<string, Record<string, any>> =
        config.nativeModulesUrl
          ? (await import(
            /* webpackIgnore: true */ config.nativeModulesUrl
          ))?.default ?? {}
          : {};
      const nativeApp = createNativeApp({
        ...config,
        uiThreadRpc,
        mainThreadRpc,
        markTimingInternal,
        customNativeModules,
      });
      const nativeLynx = createBackgroundLynx(config, nativeApp, mainThreadRpc);
      lynxCore.then(
        ({ loadCard, destroyCard, callDestroyLifetimeFun }) => {
          loadCard(nativeApp, config, nativeLynx);
          registerDisposeHandler(
            uiThreadRpc,
            nativeApp,
            destroyCard,
            callDestroyLifetimeFun,
          );
        },
      );
    },
  );
}
