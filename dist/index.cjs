var nesting = require('postcss-nesting');

// functional selector match
const functionalSelectorMatch = /(^|[^\w-])(%[_a-zA-Z]+[_a-zA-Z0-9-]*)([^\w-]|$)/i;

// plugin
const postcssExtendRule = rawopts => {
  // options ( onFunctionalSelector, onRecursiveExtend, onUnusedExtend)
  const opts = Object(rawopts);
  let extendMatch = /^extend$/i;
  if (opts.name instanceof RegExp) {
    extendMatch = opts.name;
  } else if ('name' in opts) {
    extendMatch = new RegExp(`^${opts.name}$`, 'i');
  }
  return {
    postcssPlugin: 'postcss-extend-rule',
    OnceExit(root, {
      postcss,
      result
    }) {
      const extendedAtRules = new WeakMap();

      // for each extend at-rule
      root.walkAtRules(extendMatch, extendAtRule => {
        let parent = extendAtRule.parent;
        while (parent.parent && parent.parent !== root) {
          parent = parent.parent;
        }

        // do not revisit visited extend at-rules
        if (!extendedAtRules.has(extendAtRule)) {
          extendedAtRules.set(extendAtRule, true);

          // selector identifier
          const selectorIdMatch = getSelectorIdMatch(extendAtRule.params, postcss);

          // extending rules
          const extendingRules = getExtendingRules(selectorIdMatch, extendAtRule);

          // if there are extending rules
          if (extendingRules.length) {
            // replace the extend at-rule with the extending rules
            extendAtRule.replaceWith(extendingRules);

            // transform any nesting at-rules
            const cloneRoot = postcss.root().append(parent.clone());

            // apply nesting (sync)
            postcss([nesting({
              noIsPseudoSelector: true
            })]).process(cloneRoot).sync();
            parent.replaceWith(cloneRoot);
          } else {
            // manage unused extend at-rules
            const unusedExtendMessage = `Unused extend at-rule "${extendAtRule.params}"`;
            if (opts.onUnusedExtend === 'throw') {
              throw extendAtRule.error(unusedExtendMessage, {
                word: extendAtRule.name
              });
            } else if (opts.onUnusedExtend === 'warn') {
              extendAtRule.warn(result, unusedExtendMessage);
            } else if (opts.onUnusedExtend !== 'ignore') {
              extendAtRule.remove();
            }
          }
        } else {
          // manage revisited extend at-rules
          const revisitedExtendMessage = `Revisited extend at-rule "${extendAtRule.params}"`;
          if (opts.onRecursiveExtend === 'throw') {
            throw extendAtRule.error(revisitedExtendMessage, {
              word: extendAtRule.name
            });
          } else if (opts.onRecursiveExtend === 'warn') {
            extendAtRule.warn(result, revisitedExtendMessage);
          } else if (opts.onRecursiveExtend !== 'ignore') {
            extendAtRule.remove();
          }
        }
      });
      root.walkRules(functionalSelectorMatch, functionalRule => {
        // manage encountered functional selectors
        const functionalSelectorMessage = `Encountered functional selector "${functionalRule.selector}"`;
        if (opts.onFunctionalSelector === 'throw') {
          throw functionalRule.error(functionalSelectorMessage, {
            word: functionalRule.selector.match(functionalSelectorMatch)[1]
          });
        } else if (opts.onFunctionalSelector === 'warn') {
          functionalRule.warn(result, functionalSelectorMessage);
        } else if (opts.onFunctionalSelector !== 'ignore') {
          functionalRule.remove();
        }
      });
    }
  };
};
function getExtendingRules(selectorIdMatch, extendAtRule) {
  // extending rules
  const extendingRules = [];

  // for each rule found from root of the extend at-rule with a matching selector identifier
  extendAtRule.root().walkRules(selectorIdMatch, matchingRule => {
    // nesting selectors for the selectors matching the selector identifier
    const nestingSelectors = matchingRule.selectors.filter(selector => selectorIdMatch.test(selector)).map(selector => selector.replace(selectorIdMatch, '$1&$3')).join(',');

    // matching rule’s cloned nodes
    const nestingNodes = matchingRule.clone().nodes;

    // clone the matching rule as a nested rule
    let clone = extendAtRule.clone({
      name: 'nest',
      params: nestingSelectors,
      nodes: nestingNodes,
      // empty the extending rules, as they are likely non-conforming
      raws: {}
    });

    // preserve nesting of parent rules and at-rules
    let parent = matchingRule.parent;
    while (parent && (parent.type === 'rule' || parent.type === 'atrule')) {
      clone = parent.clone().removeAll().append([clone]);
      parent = parent.parent;
    }

    // push the matching rule to the extending rules
    extendingRules.push(clone);
  });

  // return the extending rules
  return extendingRules;
}
function getSelectorIdMatch(selectorIds, postcss) {
  // escape the contents of the selector id to avoid being parsed as regex
  const escapedSelectorIds = postcss.list.comma(selectorIds).map(selectorId => selectorId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  // selector unattached to an existing selector
  return new RegExp(`(^|[^\\w-]!.!#)(${escapedSelectorIds})([^\\w-]|$)`, '');
}
postcssExtendRule.postcss = true;

module.exports = postcssExtendRule;
