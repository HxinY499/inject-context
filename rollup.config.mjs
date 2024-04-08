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

const createUMDConfig = env => {
  return {
    input: 'src/index.ts',
    output: {
      file: `./dist/umd/inject-context-${env}.js`,
      format: 'umd',
      name: 'injectContext',
      exports: 'auto',
      globals: {
        react: 'React',
      },
    },
    external: ['react'],
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
    external: ['react', 'fast-equals'],
    plugins: [tsPlugin('es'), resolvePlugin()],
  },
  createUMDConfig('development'),
  createUMDConfig('production'),
];
