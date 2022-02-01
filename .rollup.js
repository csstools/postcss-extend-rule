import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.js', format: 'cjs', sourcemap: true, strict: false, exports: 'auto' },
		{ file: 'index.mjs', format: 'esm', sourcemap: true, strict: false, exports: 'auto' }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 12 } }]
			]
		})
	]
};
