// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { isCancel } from '@clack/prompts'
import { createRsbuild, logger } from '@rsbuild/core'
import type {
  RsbuildInstance,
  RsbuildPlugin,
  RsbuildPluginAPI,
} from '@rsbuild/core'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import type { Config, ExposedAPI } from '@lynx-js/rspeedy'

import { getRandomNumberInRange } from './port.js'
import { pluginQRCode } from '../src/index.js'

const exit = vi.fn()

const pluginStubRspeedyAPI = (config: Config = {}): RsbuildPlugin => ({
  name: 'lynx:rsbuild:api',
  setup(api) {
    api.expose<ExposedAPI>(Symbol.for('rspeedy.api'), {
      config,
      debug: vi.fn(),
      exit,
      logger,
      version: '1.0.0',
    })
  },
})

vi.mock('@clack/prompts')

describe('Plugins - Terminal', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.restoreAllMocks()
    vi.mocked(isCancel).mockReturnValue(true)

    return () => vi.unstubAllEnvs()
  })

  test('not print url when printUrls: false', async () => {
    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        plugins: [pluginStubRspeedyAPI(), pluginQRCode()],
      },
    })

    await rsbuild.initConfigs()
    const rsbuildConfig = rsbuild.getRsbuildConfig()
    expect(rsbuildConfig.server?.printUrls).toBe(false)
  })

  test('not print url when printUrls: function() {}', async () => {
    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        plugins: [
          pluginStubRspeedyAPI(),
          pluginQRCode(),
          {
            name: 'test',
            setup(api: RsbuildPluginAPI) {
              api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
                return mergeRsbuildConfig(config, {
                  server: {
                    printUrls: function({ urls }) {
                      return urls.map(url => `${url}/foo`)
                    },
                  },
                })
              })
            },
          },
        ],
      },
    })

    await rsbuild.initConfigs()
    const rsbuildConfig = rsbuild.getRsbuildConfig()
    expect(rsbuildConfig.server?.printUrls).toStrictEqual(expect.any(Function))
  })

  describe('schema', () => {
    test('custom schema', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { selectKey, isCancel } = await import('@clack/prompts')
      vi.mocked(selectKey).mockResolvedValue('foo')
      vi.mocked(isCancel).mockReturnValueOnce(false)

      const { default: { generate } } = await import('qrcode-terminal')
      vi.mocked(generate).mockImplementationOnce((_, __, callback) => {
        callback?.('')
      })
      const rsbuild = await createRsbuild(
        {
          rsbuildConfig: {
            dev: {
              assetPrefix: 'http://example.com/foo/',
            },
            environments: {
              lynx: {},
            },
            server: {
              port: getRandomNumberInRange(3000, 60000),
            },
            source: {
              entry: {
                main: join(
                  dirname(fileURLToPath(import.meta.url)),
                  'fixtures',
                  'hello-world',
                ),
              },
            },
            plugins: [
              pluginStubRspeedyAPI(),
              pluginQRCode({
                schema(url) {
                  return `--${url}--`
                },
              }),
            ],
          },
        },
      )

      await using server = await usingDevServer(rsbuild)

      await server.waitDevCompileDone()

      expect(generate).toBeCalledTimes(1)

      expect(generate).toBeCalledWith(
        `--http://example.com/foo/main.lynx.bundle--`,
        {
          small: true,
        },
        expect.any(Function),
      )
    })

    test('custom schema object', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { select, selectKey, isCancel } = await import('@clack/prompts')
      vi.mocked(selectKey).mockResolvedValue('a')
      vi.mocked(isCancel).mockReturnValue(false)

      let resolve: (v: string) => void
      const promise = new Promise<string>((res) => {
        resolve = res
      })
      vi.mocked(select).mockReturnValue(promise)

      const { default: { generate } } = await import('qrcode-terminal')
      vi.mocked(generate).mockImplementationOnce((_, __, callback) => {
        callback?.('')
      })
      const rsbuild = await createRsbuild(
        {
          rsbuildConfig: {
            dev: {
              assetPrefix: 'http://example.com/foo/',
            },
            environments: {
              lynx: {},
            },
            server: {
              port: getRandomNumberInRange(3000, 60000),
            },
            source: {
              entry: {
                main: join(
                  dirname(fileURLToPath(import.meta.url)),
                  'fixtures',
                  'hello-world',
                ),
              },
            },
            plugins: [
              pluginStubRspeedyAPI(),
              pluginQRCode({
                schema(url) {
                  return {
                    foo: `==${url}==`,
                    bar: `$$${url}$$`,
                  }
                },
              }),
            ],
          },
        },
      )

      await using server = await usingDevServer(rsbuild)

      await server.waitDevCompileDone()

      expect(generate).toBeCalledTimes(1)
      expect(generate).toBeCalledWith(
        `==http://example.com/foo/main.lynx.bundle==`,
        {
          small: true,
        },
        expect.any(Function),
      )

      // @ts-expect-error xxx
      resolve('bar')

      await expect.poll(() => generate).toBeCalledTimes(2)
      expect(generate).toBeCalledWith(
        `$$http://example.com/foo/main.lynx.bundle$$`,
        {
          small: true,
        },
        expect.any(Function),
      )
    })

    test('select between entries', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { select, selectKey, isCancel } = await import('@clack/prompts')
      vi.mocked(selectKey).mockResolvedValue('r')
      vi.mocked(isCancel).mockReturnValue(false)

      let resolve: (v: string) => void
      const promise = new Promise<string>((res) => {
        resolve = res
      })
      vi.mocked(select).mockReturnValue(promise)

      const { default: { generate } } = await import('qrcode-terminal')
      vi.mocked(generate).mockImplementationOnce((_, __, callback) => {
        callback?.('')
      })
      const rsbuild = await createRsbuild(
        {
          rsbuildConfig: {
            dev: {
              assetPrefix: 'http://example.com/foo/',
            },
            environments: {
              lynx: {},
            },
            server: {
              port: getRandomNumberInRange(3000, 60000),
            },
            source: {
              entry: {
                main: join(
                  dirname(fileURLToPath(import.meta.url)),
                  'fixtures',
                  'hello-world',
                ),
                main2: join(
                  dirname(fileURLToPath(import.meta.url)),
                  'fixtures',
                  'hello-world',
                ),
              },
            },
            plugins: [
              pluginStubRspeedyAPI(),
              pluginQRCode({
                schema(url) {
                  return `==${url}==`
                },
              }),
            ],
          },
        },
      )

      await using server = await usingDevServer(rsbuild)

      await server.waitDevCompileDone()

      expect(generate).toBeCalledTimes(1)
      expect(generate).toBeCalledWith(
        `==http://example.com/foo/main.lynx.bundle==`,
        {
          small: true,
        },
        expect.any(Function),
      )

      // @ts-expect-error xxx
      resolve('main2')

      await expect.poll(() => generate).toBeCalledTimes(2)
      expect(generate).toBeCalledWith(
        `==http://example.com/foo/main2.lynx.bundle==`,
        {
          small: true,
        },
        expect.any(Function),
      )
    })
  })

  describe('QRCode', () => {
    vi.mock('qrcode-terminal')
    test('not print qrcode when build', async () => {
      const rsbuild = await createRsbuild(
        {
          rsbuildConfig: {
            source: {
              entry: {
                main: join(
                  dirname(fileURLToPath(import.meta.url)),
                  'fixtures',
                  'hello-world',
                ),
              },
            },
            plugins: [
              pluginStubRspeedyAPI(),
              pluginQRCode(),
            ],
          },
        },
      )
      await rsbuild.build()
      const QRCode = await import('qrcode-terminal')

      expect(QRCode.default.generate).not.toBeCalled()
    })

    test('print qrcode when dev', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { selectKey, isCancel } = await import('@clack/prompts')
      vi.mocked(selectKey).mockResolvedValue('foo')
      vi.mocked(isCancel).mockReturnValueOnce(false)
      const { default: { generate } } = await import('qrcode-terminal')
      vi.mocked(generate).mockImplementationOnce((_, __, callback) => {
        callback?.('')
      })
      const rsbuild = await createRsbuild(
        {
          rsbuildConfig: {
            dev: {
              assetPrefix: 'http://example.com/foo/',
            },
            environments: {
              lynx: {},
            },
            server: {
              port: getRandomNumberInRange(3000, 60000),
            },
            source: {
              entry: {
                main: join(
                  dirname(fileURLToPath(import.meta.url)),
                  'fixtures',
                  'hello-world',
                ),
              },
            },
            plugins: [
              pluginStubRspeedyAPI(),
              pluginQRCode(),
            ],
          },
        },
      )

      await using server = await usingDevServer(rsbuild)

      await server.waitDevCompileDone()

      expect(generate).toBeCalledTimes(1)
    })

    test('print qrcode when dev with host specified', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.mock('qrcode', () => ({
        generate: vi.fn(),
      }))
      const { selectKey, isCancel } = await import('@clack/prompts')
      vi.mocked(selectKey).mockResolvedValue('foo')
      vi.mocked(isCancel).mockReturnValueOnce(false)
      const rsbuild = await createRsbuild(
        {
          rsbuildConfig: {
            dev: {
              assetPrefix: 'http://example.com/foo/',
            },
            environments: {
              lynx: {},
            },
            server: {
              port: getRandomNumberInRange(3000, 60000),
            },
            source: {
              entry: {
                main: join(
                  dirname(fileURLToPath(import.meta.url)),
                  'fixtures',
                  'hello-world',
                ),
              },
            },
            plugins: [
              pluginStubRspeedyAPI(),
              pluginQRCode(),
            ],
          },
        },
      )

      const { default: { generate } } = await import('qrcode-terminal')
      vi.mocked(generate).mockImplementationOnce((_, __, callback) => {
        callback?.('')
      })

      await using server = await usingDevServer(rsbuild)

      await server.waitDevCompileDone()

      expect(generate).toBeCalledTimes(1)
      expect(generate).toBeCalledWith(
        expect.stringContaining('example.com/foo'),
        {
          small: true,
        },
        expect.anything(),
      )
    })
  })
})

async function usingDevServer(rsbuild: RsbuildInstance) {
  let done = false
  rsbuild.onDevCompileDone({
    handler: () => {
      done = true
    },
    // We make sure this is run at the last
    // Otherwise, we would call `compiler.close()` before getting stats.
    order: 'post',
  })

  const devServer = await rsbuild.createDevServer()

  const { server, port, urls } = await devServer.listen()

  return {
    port,
    urls,
    async waitDevCompileDone(timeout?: number) {
      await vi.waitUntil(() => done, { timeout: timeout ?? 5000 })
    },
    async [Symbol.asyncDispose]() {
      return await server.close()
    },
  }
}
