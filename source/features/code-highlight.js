import {h} from 'dom-chef';
import prism from 'prismjs';
import {domify} from '../libs/utils';
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

const supportedLang = new Set([
	'javascript',
	'jsx',
	'bash',
	'git',
	'typescript',
	'html',
	'css',
	'scss',
	'diff',
	'ruby',
	'rust',
	'swift',
	'java',
	'python'
]);

const aliases = new Map([
	['js', 'javascript'],
	['shell', 'bash'],
	['sh', 'bash'],
	['zsh', 'bash'],
	['py', 'python']
]);

function pickLanguage(lang) {
	if (supportedLang.has(lang)) {
		return lang;
	}
	return aliases.get(lang);
}

function highlightCode(md) {
	const codeBlockRegex = /```(\w*)([\s\S]+)```/g;
	const capturingGroup = codeBlockRegex.exec(md);

	if (capturingGroup && capturingGroup.length === 3) {
		const code = capturingGroup[2];
		const selectedLang = pickLanguage(capturingGroup[1].toLowerCase());

		if (selectedLang) {
			const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);
			return (
				<div class="refined-twitter_highlight">
					<div class="refined-twitter_highlight-lang">
						{selectedLang}
					</div>
					<pre class={`language-${selectedLang}`}>
						<code class={`language-${selectedLang}`}>
							{domify(highlightedCode)}
						</code>
					</pre>
				</div>
			);
		}
	} else {
		return md;
	}
}
function splitTextReducer(frag, text, index) {
	if (index % 2) { // Code is always in odd positions
		frag.append(highlightCode(text));
	} else if (text.length > 0) {
		frag.append(text);
	}

	return frag;
}

export default function () {
	// Regex needs to be non-capturing ?: and to have the extra () to work with .split
	const splittingRegex = /((?:```\w*[\s\S]+```))/g;
	$('.tweet-text').each((i, el) => {
		const tweetWithCode = el.textContent.split(splittingRegex);
		if (tweetWithCode.length === 1) {
			return;
		}
		const frag = el.textContent
		.split(splittingRegex)
		.reduce(splitTextReducer, new DocumentFragment());
		$(el).html(frag);
	});
}
