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

import tokenizer from '../libs/tokenizer';

const aliases = new Map([
	['js', 'javascript'],
	['shell', 'bash'],
	['sh', 'bash'],
	['zsh', 'bash'],
	['py', 'python']
]);

const pickLanguage = lang => aliases.get(lang) || lang;

function highlightCodeBlocks(compiledEl) {
	const selectedLang = pickLanguage(
		$(compiledEl)
			.find('pre code')[0]
			.className.split('-')[1]
	);

	const languageClass = selectedLang ?
		`language-${selectedLang}` :
		'language-txt';

	$(compiledEl)
		.find('pre')
		.addClass(languageClass);
	$(compiledEl)
		.find('pre code')
		.addClass(languageClass);

	$(compiledEl)
		.find('pre')
		.wrap('<div class="refined-twitter_highlight"></div>');

	const languageBar = document.createElement('div');
	languageBar.innerText = selectedLang || 'txt';
	languageBar.classList.add('refined-twitter_highlight-lang');

	$(compiledEl)
		.find('div')
		.prepend($(languageBar));

	// Highlight code
	const code = $(compiledEl).find('pre code')[0].innerText;
	const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);

	$(compiledEl)
		.find('pre code')
		.html(`<div>${highlightedCode}</div>`);
}

export default () => {
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

				const compiledEl = document.createElement('div');
				compiledEl.innerHTML = String(file);

				if ($(compiledEl).find('pre').length > 0) {
					// Format code blocks if they exist
					highlightCodeBlocks(compiledEl);
				}

				$(el).html(compiledEl);
				$(el).addClass(styledClassName);
			});
	});
};
