import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const resolvePlugin = () =>
  resolve({
    extensions: ['.js', '.ts', '.tsx'],
  });

const tsPlugin = dir =>
  typescript({
    noEmit: true,
    declaration: false,
    outDir: `./dist/${dir}`,
  });

const external = ['react'];

const createUMDConfig = env => {
  return {
    input: 'src/index.ts',
    output: {
      file: `./dist/umd/injectContext-${env}.js`,
      format: 'umd',
      name: 'injectContext',
      globals: {
        react: 'React',
      },
    },
    external,
    plugins: [
      tsPlugin('umd'),
      resolvePlugin(),
      ...(env === 'production' ? [terser()] : []),
    ],
  };
};

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: './dist/es',
      format: 'es',
    },
    external,
    plugins: [tsPlugin('es'), resolvePlugin()],
  },
  createUMDConfig('development'),
  createUMDConfig('production'),
];
