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
	const tweetText_codeBlock = tweetText.match(codeRegex);
	const _removeCodeBlock = tweetText.replace(codeRegex, '?code?');

	// resolve problems for this two var
	const tweetText_before = _removeCodeBlock.replace(textRegex, "$1");
	const tweetText_after = _removeCodeBlock.replace(textRegex, "$2");

	console.log("tweetText_codeBlock:",tweetText_codeBlock)
	console.log("")
	console.log("tweetText_before:",tweetText_before)
	console.log("")
	console.log("tweetText_after:",tweetText_after)

	if (!tweetText_codeBlock) return undefined;

	return {
		code: {
			lang: tweetText_codeBlock[1],
			text: tweetText_codeBlock[2]
		},
		before: tweetText_before,
		after: tweetText_after
	}
}

export default function () {
	const posts = $('.tweet-text');
	const codeBlockRegex = /```(\w+)([\s\S]+)```/i;
	const textRegex = /([\w\s\S]+)\?code\?\s?([\w\s\S]+)/i;

	posts.each((i, el) => {
		const postContent = $(el).text();
		const tweetText = cleanUpTweetText(postContent, codeBlockRegex, textRegex);
		// console.log(tweetText)

		if (tweetText) {
			const selectedLang = pickLanguage(tweetText.code.lang.toLowerCase());
			const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);

			const updatedHtml = (
				<div>
					<p>{tweetText.before}</p>
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
					<p>{tweetText.after}</p>
				</div>);
			$(el).html(updatedHtml);
		}
	});
}
