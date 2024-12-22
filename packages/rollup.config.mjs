import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { resolve as resolveTslib } from 'path'; // Used to resolve tslib paths

const tslibPath = resolveTslib('node_modules/tslib/tslib.es6.js');

const inputFile = 'src/index.ts'; // Entry file
const outputDir = 'dist'; // Output directory

export default [
  // UMD Build (Non-minified)
  {
    input: inputFile,
    output: {
      file: `${outputDir}/david-ai.js`,
      format: 'umd', // Universal Module Definition
      name: 'DavidAI', // Global variable for browsers
      exports: 'named', // Ensure named exports
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        tslib: tslibPath,
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      }),
    ],
  },
  // UMD Build (Minified)
  {
    input: inputFile,
    output: {
      file: `${outputDir}/david-ai.min.js`,
      format: 'umd',
      name: 'DavidAI',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        tslib: tslibPath,
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      }),
      terser(), // Minify the output
    ],
  },
  // ES Module Build
  {
    input: inputFile,
    output: {
      file: `${outputDir}/david-ai.esm.js`,
      format: 'esm', // ES module format
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        tslib: tslibPath,
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      }),
    ],
  },
];
