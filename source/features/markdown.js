import html from 'remark-html';
import unified from 'unified';
import markdown from 'remark-parse';
import twemoji from 'twemoji';
import retext from 'retext';
import smartypants from 'retext-smartypants';

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

const containsMarkdown = html =>
	[
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
		'</del>'
	].filter(tag => html.includes(tag)).length > 0;

function stripLinks(element) {
	// Strip the 'https://' from links
	const possibleLink = $(element).find('span.token.string');

	possibleLink.each((i, element) => {
		const {textContent} = element;

		if (textContent.includes('http://')) {
			// Twitter adds a trailing space to links which is why the slice is needed
			element.textContent = `${textContent.slice(
				0,
				textContent.length - 2
			)}${textContent.slice(textContent.length - 1)}`.replace('http://', '');
		}
	});
}

function highlightCodeBlocks(compiledElement) {
	$(compiledElement).wrap('<div class="refined-twitter-highlight"></div>');

	let selectedLang = pickLanguage(
		$(compiledElement)
			.find('code')
			.get(0)
			.className.split('-')[1]
	);

	if (!prism.languages[selectedLang]) {
		selectedLang = 'markup';
	}

	const languageClass = selectedLang ?
		`language-${selectedLang}` :
		'language-txt';

	$(compiledElement).addClass(languageClass);
	$(compiledElement)
		.find('code')
		.addClass(languageClass);

	const languageBar = document.createElement('div');
	languageBar.textContent = selectedLang || 'txt';
	languageBar.classList.add('refined-twitter-highlight-lang');

	$(compiledElement)
		.parent()
		.prepend($(languageBar));

	// Highlight code
	const code = $(compiledElement).find('code')[0].textContent;
	const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);

	$(compiledElement)
		.find('code')
		.html(`<div>${highlightedCode}</div>`);

	stripLinks(compiledElement);
}

async function processTweet(index, element) {
	const processed = 'refined-twitter-markdown-processed';
	const styledClassName = 'refined-twitter-markdown';

	// Ensure this only runs once per tweet
	if ($(element).hasClass(processed)) {
		return;
	}

	try {
		// Replace emoji-img-tags with the actual emoji value
		const rawElement = domify(element.innerHTML);
		const images = $(rawElement).find('img');

		for (const image of images) {
			image.replaceWith(image.alt);
		}

		const preprocessed = String(retext()
			.use(smartypants)
			.processSync(rawElement.textContent));

		const file = await unified()
			.use(markdown, {commonmark: true})
			.use(html)
			.use(tokenizer)
			.process(preprocessed);

		const processedTweet = String(file);

		if (containsMarkdown(processedTweet)) {
			const compiledElement = domify(processedTweet);
			const preBlock = $(compiledElement).find('pre');

			if (preBlock.length > 0) {
				// Format code blocks if they exist
				highlightCodeBlocks(preBlock.get(0));
			}

			const inlineCode = $(compiledElement).find('code:not([class])');

			if (inlineCode.length > 0) {
				// Strip links from inline code if there are any
				inlineCode.each((index, element) => {
					if (element.classList.length === 0) {
						// Inline code tags have no classes
						element.textContent = element.textContent.replace('http://', '');
					}
				});
			}

			$(element).html(twemoji.parse(compiledElement.innerHTML, {className: 'Emoji Emoji--forText'}));
			$(element).addClass(styledClassName);
		} else {
			$(element).html(processedTweet);
		}

		$(element)
			.addClass(processed)
			.addClass('markdown-body');
	} catch (error) {
		throw error;
	}
}

export default () => {
	const tweets = $('.tweet-text').map((element, index) => processTweet(element, index));
	Promise.all(tweets);
};
