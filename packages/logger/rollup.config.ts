import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
	{
		input: './index.ts',
		output: {
			dir: './dist',
			format: 'cjs',
			sourcemap: true,
		},
		external: ['@anyit/actor', '@anyit/log-actor', '@anyit/logger-interface'],
		plugins: [
			typescript({
				tsconfig: 'tsconfig.build.json'
			}),
		],
	},
	{
		input: 'dist/@types/index.d.ts',
		output: [{ file: 'dist/index.d.ts', format: 'es' }],
		external: ['util'],
		plugins: [dts()],
	},
];