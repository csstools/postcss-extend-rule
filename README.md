# PostCSS Extend Rule [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Extend Rule] lets you use the `@extend` at-rule and
[Functional Selectors] in CSS, following the speculative
[CSS Extend Rules Specification].

```pcss
%thick-border {
  border: thick dotted red;
}

.serious-modal {
  font-style: normal;
  font-weight: bold;

  @media (max-width: 240px) {
    @extend .modal:hover;
  }
}

.modal {
  @extend %thick-border;

  color: red;
}

.modal:hover:not(:focus) {
  outline: none;
}

/* becomes */

.serious-modal {
  font-style: normal;
  font-weight: bold;
}

@media (max-width: 240px) {
  .serious-modal:not(:focus) {
    outline: none;
  }
}

.modal {
  border: thick dotted red;
  color: red;
}

.modal:hover:not(:focus) {
  outline: none;
}
```

## Usage

Add [PostCSS Extend Rule] to your project:

```bash
npm install postcss-extend-rule --save-dev
```

Use **PostCSS Extend Rule** to process your CSS:

```js
const postcssExtendRule = require('postcss-extend-rule');

postcssExtendRule.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssExtendRule = require('postcss-extend-rule');

postcss([
  postcssExtendRule(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

**PostCSS Extend Rule** runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### name

The `name` option determines the at-rule name being used to extend selectors.
By default, this name is `extend`, meaning `@extend` rules are parsed.

```js
postcssExtend({ name: 'postcss-extend' })
```

If the `name` option were changed to, say, `postcss-extend`, then only
`@postcss-extend` at-rules would be parsed.

```pcss
main {
  @postcss-extend .some-rule;
}
```

### onFunctionalSelector

The `onFunctionalSelector` option determines how functional selectors should be
handled. Its options are:

- `remove` (default) removes any functional selector
- `ignore` ignores any functional selector and moves on
- `warn` warns the user whenever it encounters a functional selector
- `throw` throws an error if ever it encounters a functional selector

```js
postcssExtend({ onFunctionalSelector: 'remove' /* default */ })
```

```pcss
%this-will-be-removed {}
```

### onRecursiveExtend

The `onRecursiveExtend` option determines how recursive extend at-rules should
be handled. Its options are:

- `remove` (default) removes any recursive extend at-rules
- `ignore` ignores any recursive extend at-rules and moves on
- `warn` warns the user whenever it encounters a recursive extend at-rules
- `throw` throws an error if ever it encounters a recursive extend at-rules

```js
postcssExtend({ onRecursiveExtend: 'remove' /* default */ })
```

```pcss
.this-will-not-extend-itself {
  @extend .this-will-not-extend-itself;
}
```

### onUnusedExtend

The `onUnusedExtend` option determines how an unused extend at-rule should be
handled. Its options are:

- `remove` (default) removes any unused extend at-rule
- `ignore` ignores any unused extend at-rule and moves on
- `warn` warns the user whenever it encounters an unused extend at-rule
- `throw` throws an error if ever it encounters an unused extend at-rule

```js
postcssExtend({ onUnusedExtend: 'remove' /* default */ })
```

```pcss
main {
  @extend .this-selector-does-not-exist-and-will-be-removed;
}
```

[cli-img]: https://img.shields.io/travis/csstools/postcss-extend-rule/master.svg
[cli-url]: https://travis-ci.org/csstools/postcss-extend-rule
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-extend-rule.svg
[npm-url]: https://www.npmjs.com/package/postcss-extend-rule

[CSS Extend Rules Specification]: https://jonathantneal.github.io/specs/css-extend-rule/
[Functional Selectors]: https://jonathantneal.github.io/specs/css-extend-rule/#functional-selector
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Extend Rule]: https://github.com/csstools/postcss-extend-rule
