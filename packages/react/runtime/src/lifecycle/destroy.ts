// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { __root } from '../root.js';
import { delayedEvents } from './event/delayEvents.js';
import { delayedLifecycleEvents } from './event/delayLifecycleEvents.js';
import { globalCommitTaskMap } from './patch/commit.js';
import { renderBackground } from './render.js';

function destroyBackground(): void {
  if (__PROFILE__) {
    console.profile('destroyBackground');
  }

  renderBackground(null, __root as any);

  globalCommitTaskMap.forEach(task => {
    task();
  });
  globalCommitTaskMap.clear();
  // Clear delayed events which should not be executed after destroyed.
  // This is important when the page is performing a reload.
  delayedLifecycleEvents.length = 0;
  if (delayedEvents) {
    delayedEvents.length = 0;
  }
  if (__PROFILE__) {
    console.profileEnd();
  }
}

export { destroyBackground };
