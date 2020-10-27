/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import autoExternal from 'rollup-plugin-auto-external';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  plugins: [autoExternal(), nodeResolve({mainFields: ['module']})],
  output: [
    {file: 'lib/index.cjs.js', format: 'cjs', sourcemap: true},
    {file: 'lib/index.es.js', format: 'es', sourcemap: true}
  ]
};
