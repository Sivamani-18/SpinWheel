import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import url from '@rollup/plugin-url';

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'SpinWheel',
    sourcemap: true,
    exports: 'named',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    url({
      include: ['**/*.png', '**/*.mp3'],
      limit: 2 * 1024 * 1024,
      emitFiles: true,
    }),
    postcss({
      extract: true,
      minimize: true,
      modules: false,
    }),
    typescript({
      tsconfig: 'tsconfig.json',
      clean: true,
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};
