// tooling
const postcss = require('postcss');
const postcssExtendRule = require('postcss-extend-rule');
const postcssNesting = require('postcss-nesting');

// parse <style> after running its contents through a PostCSS plugin
const updateStyle = (style) => {
	postcss([
		postcssNesting,
		postcssExtendRule
	]).process(style.textContent, {
		from: style.className
	}).then(
		(result) => postcss().process(result.css.trim(), {
			from: style.className,
			stringifier: postcssToSyntaxHTML
		})
	).then(
		(result) => {
			style.parentNode.removeChild(style);

			document.body.innerHTML = `<pre class="css-root">${result.css}</pre>`;
		},
		console.error
	);
};

// update any pre-existing <style> in <head> using the PostCSS plugin
const styles = document.head.getElementsByTagName('style');

if (styles.length) {
	Array.prototype.filter.call(
		styles,
		(node) => node.nodeName === 'STYLE' && node.className === 'cp-pen-styles'
	).concat(styles[0]).slice(0, 1).forEach(updateStyle);
}

// watch for and update any new <style> in <head> using the PostCSS plugin
(new MutationObserver(
	(mutations) => mutations.forEach(
		(mutation) => Array.prototype.filter.call(
			mutation.addedNodes || [],
			(node) => node.nodeName === 'STYLE' && node.className === 'cp-pen-styles'
		).forEach(updateStyle)
	)
)).observe(
	document.head,
	{
		childList: true
	}
);

// format css as syntax-highlighted HTML
function postcssToSyntaxHTML(root, builder) {
	function toString(node, semicolon) {
		if ('atrule' === node.type) {
			return atruleToString(node, semicolon);
		} if ('rule' === node.type) {
			return ruleToString(node, semicolon);
		} else if ('decl' === node.type) {
			return declToString(node, semicolon);
		} else if ('comment' === node.type) {
			return commentToString(node, semicolon);
		} else {
			return node.nodes ? node.nodes.map((childNodes) => toString(childNodes, semicolon)).join('') : node.toString();
		}
	}

	function atruleToString(atrule, semicolon) {
		return `${atrule.raws.before||''}<span class=css-atrule><span class=css-atrule-name>@${atrule.name}</span>${atrule.raws.afterName||''}<span class=css-atrule-params>${atrule.params}</span>${atrule.raws.between||''}${atrule.nodes?`<span class=css-block>{${atrule.nodes.map((node) => toString(node, atrule.raws.semicolon)).join('')}${atrule.raws.after||''}}</span>`:semicolon||true?';':''}</span>`;
	}

	function ruleToString(rule, semicolon) {
		return `${rule.raws.before||''}<span class=css-rule><span class=css-selector>${rule.selector}</span>${rule.raws.between||''}<span class=css-block>{${rule.nodes.map((node) => toString(node, rule.raws.semicolon)).join('')}${rule.raws.after||''}}</span></span>`;
	}

	function declToString(decl, semicolon) {
		return `${decl.raws.before || ''}<span class=css-declaration><span class=css-property>${decl.prop}</span>${decl.raws.between || ':'}<span class=css-value>${decl.value}</span>${semicolon||true?';':''}</span>`;
	}

	function commentToString(comment, semicolon) {
		return `${comment.raws.before}<span class=css-comment>/*${comment.raws.left}${comment.text}${comment.raws.right}*/</span>`;
	}

	builder(
		toString(root)
	);
}