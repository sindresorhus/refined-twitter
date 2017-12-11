import {h} from 'dom-chef';
import prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';

const supportedLang = new Set(['javascript', 'jsx', 'bash', 'git', 'typescript', 'html', 'css', 'scss']);
const aliases = {
	javascript: new Set(['js']),
	jsx: new Set(['react', 'reactjsx']),
	bash: new Set(['zsh', 'sh', 'shell'])
};

function correctLanguage(lang) {
	if (supportedLang.has(lang)) {
		return lang;
	}
	for (const key in aliases) {
		if (aliases[key].has(lang)) {
			return key;
		}
	}
}

function string2dom(domString) {
	const dom = document.createElement('div');
	dom.innerHTML = domString;
	return dom;
}

export default function () {
	const postsContent = $('.tweet-text');

	postsContent.each((i, el) => {
		const regex = /```(\w.*)([^.*]+)```/g;
		const postContent = $(el).text();
		const capturingGroup = regex.exec(postContent);

		if (capturingGroup && capturingGroup.length === 3) {
			const code = capturingGroup[2];
			const selectedLang = correctLanguage(capturingGroup[1].toLowerCase());
			const tweetText = postContent.replace(regex, '');

			if (selectedLang) {
				const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);
				const updatedHtml = (
					<div>
						<p>{tweetText}</p>
						<div class="refined-twitter_highlight">
							<div class="refined-twitter_highlight-lang">
								{selectedLang}
							</div>
							<pre class={`language-${selectedLang}`}>
								<code class={`language-${selectedLang}`}>
									{string2dom(highlightedCode)}
								</code>
							</pre>
						</div>
					</div>);
				$(el).html(updatedHtml);
			}
		}
	});
}
