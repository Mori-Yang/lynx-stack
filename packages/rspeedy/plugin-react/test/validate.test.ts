// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { describe, expect, test } from 'vitest'

import type { CompatVisitorConfig } from '@lynx-js/react/transform'

import { validateConfig } from '../src/validate.js'

describe('Validation', () => {
  test('default', () => {
    expect(validateConfig(undefined)).toBe(undefined)
    expect(validateConfig({})).toStrictEqual({})

    expect(() => validateConfig([]))
      .toThrowErrorMatchingInlineSnapshot(
        `
        [Error: Invalid config on pluginReactLynx: \`$input\`.
          - Expect to be (PluginReactLynxOptions | undefined)
          - Got: array
        ]
      `,
      )
    expect(() => validateConfig(null))
      .toThrowErrorMatchingInlineSnapshot(
        `
        [Error: Invalid config on pluginReactLynx: \`$input\`.
          - Expect to be (PluginReactLynxOptions | undefined)
          - Got: null
        ]
      `,
      )
  })

  test('unknown properties', () => {
    expect(() => validateConfig({ foo: 0 }))
      .toThrowErrorMatchingInlineSnapshot(
        `[Error: Unknown property: \`$input.foo\` in the configuration of pluginReactLynx]`,
      )
  })

  test('compat', () => {
    const cases: Partial<CompatVisitorConfig>[] = [
      {},
      { addComponentElement: false },
      { addComponentElement: true },
      { componentsPkg: [] },
      { componentsPkg: ['foo'] },
      { disableDeprecatedWarning: true },
      { disableDeprecatedWarning: false },
    ]

    cases.forEach(compat => {
      expect(validateConfig({ compat })).toStrictEqual({ compat })
    })
  })

  test('targetSdkVersion', () => {
    expect(validateConfig({ targetSdkVersion: '3.2' })).toStrictEqual({
      targetSdkVersion: '3.2',
    })
    expect(() => validateConfig({ targetSdkVersion: 3.4 }))
      .toThrowErrorMatchingInlineSnapshot(`
        [Error: Invalid config on pluginReactLynx: \`$input.targetSdkVersion\`.
          - Expect to be (string | undefined)
          - Got: number
        ]
      `)
  })

  test('debugInfoOutside', () => {
    expect(validateConfig({ debugInfoOutside: true })).toStrictEqual({
      debugInfoOutside: true,
    })
    expect(() => validateConfig({ debugInfoOutside: 2.11 }))
      .toThrowErrorMatchingInlineSnapshot(`
        [Error: Invalid config on pluginReactLynx: \`$input.debugInfoOutside\`.
          - Expect to be (boolean | undefined)
          - Got: number
        ]
      `)
  })

  test('enableRemoveCSSScope', () => {
    expect(validateConfig({ enableRemoveCSSScope: true })).toStrictEqual({
      enableRemoveCSSScope: true,
    })
    expect(() => validateConfig({ enableRemoveCSSScope: null }))
      .toThrowErrorMatchingInlineSnapshot(`
        [Error: Invalid config on pluginReactLynx: \`$input.enableRemoveCSSScope\`.
          - Expect to be (boolean | undefined)
          - Got: null
        ]
      `)
  })

  test('enableCSSSelector', () => {
    expect(validateConfig({ enableCSSSelector: true })).toStrictEqual({
      enableCSSSelector: true,
    })
    expect(() => validateConfig({ enableCSSSelector: null }))
      .toThrowErrorMatchingInlineSnapshot(`
        [Error: Invalid config on pluginReactLynx: \`$input.enableCSSSelector\`.
          - Expect to be (boolean | undefined)
          - Got: null
        ]
      `)
  })
})
