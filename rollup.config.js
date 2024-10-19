import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const { BUILD_ENV } = process.env

const config = {
  input: 'src/index.jsx',
  output: {
    name: 'withSsrSideEffect',
    file: 'lib/',

    globals: {
      react: 'React',
    },
  },
  plugins: [
    babel({
      babelrc: false,
      presets: [
        '@babel/preset-react',
        ['@babel/preset-env', { loose: true, modules: false }],
      ],
      babelHelpers: 'bundled',
      plugins: [],
      exclude: 'node_modules/**',
    }),
  ],
  external: ['react'],
}

if (BUILD_ENV === 'production') {
  config.plugins.push(terser())
}

export default config