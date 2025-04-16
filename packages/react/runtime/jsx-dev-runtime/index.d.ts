// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
export { jsxDEV, Fragment } from 'react/jsx-dev-runtime';
export { jsx, jsxs } from 'react/jsx-runtime';
import { JSX as _JSX } from 'react';

export namespace JSX {
  interface IntrinsicElements extends _IntrinsicElements {
  }

  interface IntrinsicAttributes {
    ref?: unknown | ((e: unknown) => void) | undefined;
  }

  type Element = _JSX.Element;
}
