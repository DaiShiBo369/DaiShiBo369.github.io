const escapeScriptText = text => text.replace(/<\/script/gi, '<\\/script');

hexo.extend.filter.register('marked:extensions', function (extensions) {
  extensions.push({
    name: 'blockMath',
    level: 'block',
    tokenizer(src) {
      const cap = /^\s{0,3}\$\$([\s\S]+?)\n{0,1}\$\$(?:\n|$)/.exec(src);

      if (!cap) return undefined;

      return {
        type: 'blockMath',
        raw: cap[0],
        text: cap[1].trim()
      };
    },
    renderer(token) {
      return `<div class="mathjax-display"><script type="math/tex; mode=display">${escapeScriptText(token.text)}</script></div>\n`;
    }
  });

  extensions.push({
    name: 'inlineMath',
    level: 'inline',
    start(src) {
      const index = src.indexOf('$');
      return index === -1 ? undefined : index;
    },
    tokenizer(src) {
      const cap = /^\$(?!\$)((?:\\.|[^\n$])+?)\$/.exec(src);

      if (!cap) return undefined;

      return {
        type: 'inlineMath',
        raw: cap[0],
        text: cap[1].trim()
      };
    },
    renderer(token) {
      return `<span class="mathjax-inline"><script type="math/tex">${escapeScriptText(token.text)}</script></span>`;
    }
  });
});
