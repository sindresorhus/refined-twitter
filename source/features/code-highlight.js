import prism from "prismjs";

export default function() {
	const postsContent = $(".stream .stream-items > li .js-tweet-text-container > p");
	const regex = /```(\w.*)([^```]+)```/g;

	postsContent.each((i,el) => {
		const postContent = $(el).text();
		const capturingGroup = regex.exec(postContent);

		if (capturingGroup && capturingGroup.length === 3) {
			const code = capturingGroup[2];
			const selectedLang = capturingGroup[1].toLowerCase();
			const html = Prism.highlight(code, Prism.languages[selectedLang]);
			const updatedHtml = `
				<pre class='RT_highlight'>
					<div class='RT_highlight__lang'>
					${selectedLang}
					</div>
					<code class='RT_highlight'>
						${html}
					</code>
				</pre>`

			const newContent = postContent.replace(regex, updatedHtml)
			$(el).html(newContent)
		}
	});
}
