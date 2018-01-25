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

function cleanUpTweetText(tweet, codeRegex) {
	const tweetCodeBlock = tweet.match(codeRegex);
	const _removeCodeBlock = tweet.replace(codeRegex, '?@code@?');
	const tweetText = _removeCodeBlock.split('?@code@?');

	if (!tweetCodeBlock) {
		return undefined;
	}

	return {
		code: {
			lang: tweetCodeBlock[1],
			text: tweetCodeBlock[2]
		},
		before: tweetText[0],
		after: tweetText[1]
	};
}

export default function () {
	const posts = $('.tweet-text');
	const codeBlockRegex = /```(\w+)([\s\S]+)```/i;

	posts.each((i, el) => {
		const postContent = $(el).text();
		const tweet = cleanUpTweetText(postContent, codeBlockRegex);

		if (tweet) {
			const selectedLang = pickLanguage(tweet.code.lang.toLowerCase());
			if (!selectedLang) {
				return;
			}

			const highlightedCode = prism.highlight(tweet.code.text, prism.languages[selectedLang]);
			const updatedHtml = (
				<div>
					<p>{tweet.before}</p>
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
					<p>{tweet.after}</p>
				</div>);
			$(el).html(updatedHtml);
		}
	});
}
