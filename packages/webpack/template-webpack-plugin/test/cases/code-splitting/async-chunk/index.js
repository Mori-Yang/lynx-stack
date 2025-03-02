/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
/// <reference types="vitest/globals" />

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

it('should have correct chunk content', async () => {
  const { foo } = await import(
    /* webpackChunkName: 'foo:main-thread' */
    './foo.js'
  );
  expect(foo()).toBe(42);

  const fooBackground = await import(
    /* webpackChunkName: 'foo:background' */
    './foo.js'
  );
  expect(fooBackground.foo()).toBe(42);
});

it('should generate correct foo template', async () => {
  const tasmJSONPath = resolve(__dirname, '.rspeedy/async/foo/tasm.json');
  expect(existsSync(tasmJSONPath)).toBeTruthy();

  const content = await readFile(tasmJSONPath, 'utf-8');
  const { sourceContent, manifest } = JSON.parse(content);
  expect(sourceContent).toHaveProperty('appType', 'DynamicComponent');
  expect(manifest).toHaveProperty(
    '/foo:background.rspack.bundle.js',
    expect.stringContaining('function foo()'),
  );
});
