import prism from "prismjs";
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-git'

export default function() {
	const postsContent = $(".stream .stream-items > li .js-tweet-text-container > p");
	const regex = /```(\w.*)([^```]+)```/g;
	postsContent.each((i,el) => {
		const postContent = $(el).text();
		const capturingGroup = regex.exec(postContent);

		if (capturingGroup && capturingGroup.length === 3) {
			const code = capturingGroup[2].replace(/↵/g, "");
			const selectedLang = capturingGroup[1].toLowerCase();
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
		}
	});
}
