import {h} from 'dom-chef';
import prism from 'prismjs';
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-scss'

const supportedLang = new Set(["javascript", "jsx", "bash", "git", "typescript", "html", "css", "scss"]);

function isSupportedLanguage(lang) {
	return supportedLang.has(lang);
};

function string2dom(domString) {
	const dom = document.createElement('div');
	dom.innerHTML = domString;
	return dom;
};

export default function() {
	const postsContent = $(".tweet-text");

	postsContent.each((i,el) => {
		const regex = /```(\w.*)([^```]+)```/g;
		const postContent = $(el).text();
		const capturingGroup = regex.exec(postContent);

		if (capturingGroup && capturingGroup.length === 3) {
			const code = capturingGroup[2];
			const selectedLang = capturingGroup[1].toLowerCase();
			const tweetText = postContent.replace(regex, "");

			if (isSupportedLanguage(selectedLang)) {
				const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);
				const updatedHtml = (
					<div>
						<p>{tweetText}</p>
						<div class="RT_highlight">
							<div class='RT_highlight__lang'>
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
			};
		};
	});
};
