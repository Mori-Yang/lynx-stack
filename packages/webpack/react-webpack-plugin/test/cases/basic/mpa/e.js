/// <reference types="vitest/globals" />

import fs from 'node:fs';
import path from 'node:path';

console.info('**eee**');

it('should have "eee" in e:main-thread.js', async () => {
  const target = path.resolve(__dirname, 'e:main-thread.js');
  expect(fs.existsSync(target));

  const content = await fs.promises.readFile(target, 'utf-8');

  expect(content).toContain(['**', 'eee', '**'].join(''));
});
