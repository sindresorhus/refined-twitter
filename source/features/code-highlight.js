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

export default function () {
	const postsContent = $('.tweet-text');

	postsContent.each((i, el) => {
		const codeBlockRegex = /```(\w*)([\s\S]+)```/g;
		const postContent = $(el).text();
		const capturingGroup = codeBlockRegex.exec(postContent);

		if (capturingGroup && capturingGroup.length === 3) {
			const code = capturingGroup[2];
			const selectedLang = pickLanguage(capturingGroup[1].toLowerCase());
			const tweetText = postContent.replace(codeBlockRegex, '');

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
									{domify(highlightedCode)}
								</code>
							</pre>
						</div>
					</div>);
				$(el).html(updatedHtml);
			}
		}
	});
}
