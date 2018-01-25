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

function cleanUpTweetText(tweetText, codeRegex, textRegex) {
	const tweet_codeBlock = tweetText.match(codeRegex);
	const _removeCodeBlock = tweetText.replace(codeRegex, '?@code@?');
	const tweet_text = _removeCodeBlock.split('?@code@?');

	if (!tweet_codeBlock) return undefined;

	return {
		code: {
			lang: tweet_codeBlock[1],
			text: tweet_codeBlock[2]
		},
		before: tweet_text[0],
		after: tweet_text[1]
	}
}

export default function () {
	const posts = $('.tweet-text');
	const codeBlockRegex = /```(\w+)([\s\S]+)```/i;
	const textRegex = /([\w\s\S]+)\?code\?\s?([\w\s\S]+)/i;

	posts.each((i, el) => {
		const postContent = $(el).text();
		const tweet = cleanUpTweetText(postContent, codeBlockRegex, textRegex);

		if (tweet) {
			const selectedLang = pickLanguage(tweet.code.lang.toLowerCase());
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
