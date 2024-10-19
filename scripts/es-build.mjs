import { build } from 'esbuild';
import { join } from 'node:path';

const entryPoint = join(import.meta.dirname, '../src/index.jsx')

import pkg from '../package.json' assert { type: "json" };

const { dependencies = {}, peerDependencies = {} } = pkg

const external = Object.keys(dependencies).concat(Object.keys(peerDependencies))

const shared = {
  entryPoints: [entryPoint],
  bundle: true,
  external,
};

build({
  ...shared,
  format: 'cjs',
  outfile: 'lib/index.cjs',
});

build({
  ...shared,
  outfile: 'lib/index.esm.js',
  format: 'esm',
});

build({
  ...shared,
  format: 'cjs',
  outfile: 'lib/index.min.cjs',
  minify: true,
});

build({
  ...shared,
  outfile: 'lib/index.esm.min.js',
  format: 'esm',
  minify: true
});