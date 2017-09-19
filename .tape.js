module.exports = {
	'postcss-extend-rule': {
		'basic': {
			message: 'supports basic usage'
		},
		'advanced': {
			message: 'supports advanced usage (with postcss-nesting)',
			plugin: () => require('postcss')(
				require('postcss-nesting'),
				require('.')
			)
		},
		'nested-media': {
			'message': 'supports nested @media usage'
		},
		'nested-media:nesting': {
			'message': 'supports nested @media usage (with postcss-nesting)',
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
