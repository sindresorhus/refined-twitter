import html from 'remark-html';
import unified from 'unified';
import markdown from 'remark-parse';

import prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-r';

import {domify} from '../libs/utils';
import tokenizer from '../libs/tokenizer';

const aliases = new Map([
	['js', 'javascript'],
	['shell', 'bash'],
	['sh', 'bash'],
	['zsh', 'bash'],
	['py', 'python']
]);

const pickLanguage = lang => aliases.get(lang) || lang;

const containsMarkdown = html => {
	const tags = [
		'</code>',
		'</pre>',
		'</strong>',
		'</em>',
		'</ul>',
		'</ol>',
		'</blockquote>',
		'</h1>',
		'</h2>',
		'</h3>',
		'</h4>',
		'</del>',
		'</a>'
	];
	return tags.filter(tag => html.includes(tag)).length > 0;
};

function highlightCodeBlocks(compiledEl) {
	$(compiledEl).wrap('<div class="refined-twitter_highlight"></div>');

	const selectedLang = pickLanguage(
		$(compiledEl)
			.find('code')[0]
			.className.split('-')[1]
	);

	const languageClass = selectedLang ?
		`language-${selectedLang}` :
		'language-txt';

	$(compiledEl).addClass(languageClass);
	$(compiledEl)
		.find('code')
		.addClass(languageClass);

	const languageBar = document.createElement('div');
	languageBar.innerText = selectedLang || 'txt';
	languageBar.classList.add('refined-twitter_highlight-lang');

	$(compiledEl)
		.parent()
		.prepend($(languageBar));

	// Highlight code
	const code = $(compiledEl).find('code')[0].innerText;
	const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);

	$(compiledEl)
		.find('code')
		.html(`<div>${highlightedCode}</div>`);
}

export default () => {
	const processed = 'refined-twitter_markdown-processed';
	const styledClassName = 'refined-twitter_markdown';

	$('.tweet-text').each((i, el) => {
		// Ensure this is only run once
		if ($(el).hasClass(styledClassName)) {
			return;
		}

		unified()
			.use(markdown)
			.use(html)
			.use(tokenizer)
			.process(el.textContent, (err, file) => {
				if (err) {
					throw err;
				}

				if (containsMarkdown(String(file))) {
					const compiledEl = domify(String(file));
					const preBlock = $(compiledEl).find('pre');

					if (preBlock.length > 0) {
						// Format code blocks if they exist
						highlightCodeBlocks(preBlock[0]);
					}

					$(el).html(compiledEl.childNodes);
					$(el).addClass(styledClassName);
				}

				$(el).addClass(processed);
			});
	});
};
