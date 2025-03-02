import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createConfig } from '../../../create-react-config.js';
import {
  LynxTemplatePlugin,
  LynxEncodePlugin,
} from '@lynx-js/template-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultConfig = createConfig({}, {
  mainThreadChunks: ['main:main-thread.js'],
}, {});

/** @type {import('@rspack/core').Configuration} */
export default {
  context: __dirname,
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    new LynxEncodePlugin(),
    new LynxTemplatePlugin({
      chunks: ['main:main-thread', 'main:background'],
      filename: 'main/template.json',
      intermediate: '.rspeedy',
    }),
  ],
};
