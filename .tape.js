module.exports = {
	'postcss-extend-rule': {
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
			plugin: () => require('postcss')(
				require('postcss-nesting'),
				require('.')
			)
		},
		'nested-media': {
			'message': 'supports nested @media usage'
		},
		'nested-media:nesting-first': {
			'message': 'supports nested @media usage when postcss-nesting runs first',
			plugin: () => require('postcss')(
				require('postcss-nesting'),
				require('.')
			)
		},
		'nested-media:nesting-second': {
			'message': 'supports nested @medi usage when postcss-nesting runs second',
			plugin: () => require('postcss')(
				require('.'),
				require('postcss-nesting')
			)
		},
		'errors': {
			message: 'manages error-ridden usage'
		},
		'errors:ignore': {
			message: 'manages error-ridden usage with { onFunctionalSelector: "ignore", onRecursiveExtend: "ignore", onUnusedExtend: "ignore" } options',
			options: {
				onFunctionalSelector: 'ignore',
				onRecursiveExtend: 'ignore',
				onUnusedExtend: 'ignore'
			}
		},
		'errors:warn': {
			message: 'manages error-ridden usage with { onFunctionalSelector: "warn", onRecursiveExtend: "warn", onUnusedExtend: "warn" } options',
			options: {
				onFunctionalSelector: 'warn',
				onRecursiveExtend: 'warn',
				onUnusedExtend: 'warn'
			},
			warning: 6
		},
		'errors:throw': {
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
		'errors:throw-on-functional-selectors': {
			message: 'manages error-ridden usage with { onFunctionalSelector: "throw" } options',
			options: {
				onFunctionalSelector: 'throw'
			},
			error: {
				reason: 'Encountered functional selector "%test-placeholder"'
			}
		}
	}
};
