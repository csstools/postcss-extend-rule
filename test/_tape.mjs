import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-extend-rule';
import postcssNesting from 'postcss-nesting';
import postcssGlobalData from '@csstools/postcss-global-data';

postcssTape(plugin)({
	'basic': {
		message: 'supports @extend usage',
	},
	'basic:name': {
		message: 'ignores @extend usage when { name: "postcss-extend" }',
		options: {
			name: 'postcss-extend',
		},
	},
	'basic-postcss-name': {
		message: 'supports @postcss-extend when { name: "postcss-extend" }',
		options: {
			name: 'postcss-extend',
		},
	},
	'basic-button': {
		message: 'supports @extend usage with same tag name and class name',
	},
	'injected-extend': {
		message: 'supports injected extend usage',
		plugins: [
			plugin,
			postcssGlobalData({
				files: [
					'test/injected/extend.css',
				],
			}),
		],
	},
	'injected-styles': {
		message: 'supports injected styles usage',
		plugins: [
			plugin,
			postcssGlobalData({
				files: [
					'test/injected/style.css',
				],
			}),
		],
	},
	'advanced': {
		message: 'supports mixed usage (with postcss-nesting)',
		plugins: [postcssNesting, plugin],
	},
	'nested-media': {
		'message': 'supports nested @media usage',
	},
	'nested-media:nesting-first': {
		'message': 'supports nested @media usage when postcss-nesting runs first',
		plugins: [postcssNesting, plugin],
	},
	'nested-media:nesting-second': {
		'message': 'supports nested @media usage when postcss-nesting runs second',
		plugins: [plugin, postcssNesting],
	},
	'error': {
		message: 'manages error-ridden usage',
	},
	'error:ignore': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "ignore", onRecursiveExtend: "ignore", onUnusedExtend: "ignore" } options',
		options: {
			onFunctionalSelector: 'ignore',
			onRecursiveExtend: 'ignore',
			onUnusedExtend: 'ignore',
		},
	},
	'error:warn': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "warn", onRecursiveExtend: "warn", onUnusedExtend: "warn" } options',
		options: {
			onFunctionalSelector: 'warn',
			onRecursiveExtend: 'warn',
			onUnusedExtend: 'warn',
		},
		warnings: 2,
	},
	'error:throw': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "throw", onRecursiveExtend: "throw", onUnusedExtend: "throw" } options',
		options: {
			onFunctionalSelector: 'throw',
			onRecursiveExtend: 'throw',
			onUnusedExtend: 'throw',
		},
		exception: /Unused extend at-rule "some-non-existent-selector"/,
	},
	'error:throw-on-functional-selectors': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "throw" } options',
		options: {
			onFunctionalSelector: 'throw',
		},
		exception: /Encountered functional selector "%test-placeholder"/,
	},
	'issue-8': {
		message: 'https://github.com/csstools/postcss-extend-rule/issues/8',
	},
	'issue-10': {
		message: 'https://github.com/csstools/postcss-extend-rule/issues/10',
	},
	'spec-example-1': {
		message: 'specification example 1',
	},
	'spec-example-3': {
		message: 'specification example 3',
	},
	'spec-example-4': {
		message: 'specification example 4',
	},
	'spec-example-5': {
		message: 'specification example 5',
	},
	'spec-example-6': {
		message: 'specification example 6',
	},
	'spec-example-7': {
		message: 'specification example 7',
	},
});
