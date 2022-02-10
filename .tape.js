const postcss = require('postcss');
const postcssNesting = require('postcss-nesting');
const postcssExtends = require('.');

module.exports = {
	'basic': {
		message: 'supports @extend usage'
	},
	'basic:name': {
		message: 'ignores @extend usage when { name: "postcss-extend" }',
		options: {
			name: 'postcss-extend'
		},
		expect: 'basic.css'
	},
	'basic-postcss-name': {
		message: 'supports @postcss-extend when { name: "postcss-extend" }',
		options: {
			name: 'postcss-extend'
		},
		expect: 'basic.expect.css'
	},
	'basic.button': {
		message: 'supports @extend usage with same tag name and class name',
		expect: 'basic.button.expect.css'
	},
	'advanced': {
		message: 'supports mixed usage (with postcss-nesting)',
		plugin: postcss(postcssNesting, postcssExtends)
	},
	'nested-media': {
		'message': 'supports nested @media usage'
	},
	'nested-media:nesting-first': {
		'message': 'supports nested @media usage when postcss-nesting runs first',
		plugin: postcss(postcssNesting, postcssExtends)
	},
	'nested-media:nesting-second': {
		'message': 'supports nested @media usage when postcss-nesting runs second',
		plugin: postcss(postcssExtends, postcssNesting)
	},
	'error': {
		message: 'manages error-ridden usage'
	},
	'error:ignore': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "ignore", onRecursiveExtend: "ignore", onUnusedExtend: "ignore" } options',
		options: {
			onFunctionalSelector: 'ignore',
			onRecursiveExtend: 'ignore',
			onUnusedExtend: 'ignore'
		}
	},
	'error:warn': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "warn", onRecursiveExtend: "warn", onUnusedExtend: "warn" } options',
		options: {
			onFunctionalSelector: 'warn',
			onRecursiveExtend: 'warn',
			onUnusedExtend: 'warn'
		},
		warnings: 2
	},
	'error:throw': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "throw", onRecursiveExtend: "throw", onUnusedExtend: "throw" } options',
		options: {
			onFunctionalSelector: 'throw',
			onRecursiveExtend: 'throw',
			onUnusedExtend: 'throw'
		},
		error: {
			reason: 'Unused extend at-rule "some-non-existent-selector"'
		}
	},
	'error:throw-on-functional-selectors': {
		message: 'manages error-ridden usage with { onFunctionalSelector: "throw" } options',
		options: {
			onFunctionalSelector: 'throw'
		},
		error: {
			reason: 'Encountered functional selector "%test-placeholder"'
		}
	}
};
