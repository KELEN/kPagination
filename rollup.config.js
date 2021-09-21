import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

export default {
  input: 'src/index.ts', 
  output: { 
    file: pkg.browser, // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
    format: 'umd',
    name: 'KPagination',
  },
  plugins: [
    commonjs(),
    typescript()
  ]
}; 