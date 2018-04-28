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
import 'prismjs/components/prism-r';

const aliases = new Map([
	['js', 'javascript'],
	['shell', 'bash'],
	['sh', 'bash'],
	['zsh', 'bash'],
	['py', 'python']
]);

function pickLanguage(lang) {
	return aliases.get(lang) || lang;
}

function highlightCode(md) {
	const codeBlockRegex = /```(\w*)([\s\S]+)```/g;
	const [, lang, code] = codeBlockRegex.exec(md) || [];
	if (!code) {
		return md;
	}

	const selectedLang = pickLanguage(lang.toLowerCase());
	if (!selectedLang) {
		return (
			<pre class="refined-twitter_highlight language-txt">
				<code class="language-txt">
					{code}
				</code>
			</pre>
		);
	}

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
	const splittingRegex = /((?:```\w*[\s\S]+```\n?))/g;
	$('.tweet-text').each((i, el) => {
		const tweetWithCode = el.textContent.split(splittingRegex);
		if (tweetWithCode.length === 1) {
			return;
		}
		const frag = tweetWithCode.reduce(splitTextReducer, new DocumentFragment());
		$(el).html(frag);
	});
}
