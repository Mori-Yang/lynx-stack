// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import * as ReactAPIs from '@lynx-js/react';
import * as ReactInternal from '@lynx-js/react/internal';
import * as ReactJSXDevRuntime from '@lynx-js/react/jsx-dev-runtime';
import * as ReactJSXRuntime from '@lynx-js/react/jsx-runtime';
import * as ReactLegacyReactRuntime from '@lynx-js/react/legacy-react-runtime';
import * as ReactLepusAPIs from '@lynx-js/react/lepus';

import {
  sExportsJSXDevRuntime,
  sExportsJSXRuntime,
  sExportsLegacyReactRuntime,
  sExportsReact,
  sExportsReactInternal,
  sExportsReactLepus,
  target,
} from './target';

Object.defineProperty(target, sExportsReact, {
  value: ReactAPIs,
  enumerable: false,
  writable: false,
});

Object.defineProperty(target, sExportsReactLepus, {
  value: ReactLepusAPIs,
  enumerable: false,
  writable: false,
});

Object.defineProperty(target, sExportsReactInternal, {
  value: ReactInternal,
  enumerable: false,
  writable: false,
});

Object.defineProperty(target, sExportsJSXRuntime, {
  value: ReactJSXRuntime,
  enumerable: false,
  writable: false,
});

Object.defineProperty(target, sExportsJSXDevRuntime, {
  value: ReactJSXDevRuntime,
  enumerable: false,
  writable: false,
});

Object.defineProperty(target, sExportsLegacyReactRuntime, {
  value: ReactLegacyReactRuntime,
  enumerable: false,
  writable: false,
});
