// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import path from 'node:path'

import { createRsbuild } from '@rsbuild/core'
import type {
  InspectConfigOptions,
  InspectConfigResult,
  RsbuildConfig,
  RsbuildInstance,
} from '@rsbuild/core'

import { applyDefaultRspeedyConfig } from './config/defaults.js'
import type { Config } from './config/index.js'
import { toRsbuildConfig } from './config/rsbuild/index.js'

/**
 * The instance of Rspeedy.
 *
 * @public
 */
export type RspeedyInstance = RsbuildInstance & {
  getRspeedyConfig(): Config
}

/**
 * The options of `createRspeedy` method.
 *
 * @public
 */
export interface CreateRspeedyOptions {
  /**
   * The root path of the current build.
   */
  cwd?: string
  /**
   * The config of Rspeedy.
   */
  rspeedyConfig?: Config
}
/**
 * The `createRspeedy` method can let you create a Rspeedy instance and you can customize the build or development process in Node.js Runtime.
 *
 * @param options - {@link CreateRspeedyOptions}
 * @returns - Rspeedy instance.
 *
 * @example
 *
 * ```ts
 * import { createRspeedy } from '@lynx-js/rspeedy'
 *
 * void async function () {
 *   const rspeedy = await createRspeedy({})
 *   await rspeedy.build()
 * }()
 * ```
 *
 * @public
 */
export async function createRspeedy(
  { cwd = process.cwd(), rspeedyConfig = {} }: CreateRspeedyOptions,
): Promise<RspeedyInstance> {
  const config = applyDefaultRspeedyConfig(rspeedyConfig)

  const [rspeedy, { applyDefaultPlugins }] = await Promise.all([
    createRsbuild({
      cwd,
      rsbuildConfig: toRsbuildConfig(config) as RsbuildConfig,
    }),
    import('./plugins/index.js'),
  ])

  await applyDefaultPlugins(rspeedy, config)

  const inspectConfig = rspeedy.inspectConfig.bind(rspeedy)

  return Object.assign(rspeedy, {
    getRspeedyConfig: () => config,
    async inspectConfig(
      options: InspectConfigOptions,
    ): Promise<InspectConfigResult> {
      const result = await inspectConfig(options)
      const { inspectRspeedyConfig } = await import(
        './plugins/inspect.plugin.js'
      )
      await inspectRspeedyConfig(
        rspeedyConfig,
        path.resolve(
          options.outputPath ?? rspeedy.context.distPath,
          '.rsbuild/rspeedy.config.js',
        ),
        options.verbose ?? false,
      )
      return result
    },
  })
}
