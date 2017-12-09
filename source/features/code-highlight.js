import prism from "prismjs";
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-scss'

function isSupportedLanguage(lang) {
	const supportedLang = ["javascript", "jsx", "bash", "git", "typescript", "html", "css", "scss"]
	return supportedLang.includes(lang);
}

export default function() {
	const postsContent = $(".stream .stream-items > li .js-tweet-text-container > p");

	postsContent.each((i,el) => {
		const regex = /```(\w.*)([^```]+)```/g;
		const postContent = $(el).text();
		const capturingGroup = regex.exec(postContent);

		if (capturingGroup && capturingGroup.length === 3) {
			const code = capturingGroup[2].replace(/↵/g, "");
			const selectedLang = capturingGroup[1].toLowerCase();

			if (isSupportedLanguage(selectedLang)) {
				const highlightedCode = prism.highlight(code, prism.languages[selectedLang]);
				const updatedHtml = `
					<pre class='language-${selectedLang}'>
						<div class='RT_highlight__lang'>
						${selectedLang}
						</div>
						<code class='language-${selectedLang}'>
							<div>${highlightedCode}</div>
						</code>
					</pre>`
				const newContent = postContent.replace(regex, updatedHtml)
				$(el).html(newContent)
			} else {
				return true;
			}
		}
	});
}
