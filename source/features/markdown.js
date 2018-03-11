import {h} from 'dom-chef';

function styleInlineCode(md) {
	console.log(md);
	return (
		<code class="refined_twitter_markdown">
			{md}
		</code>
	);
}

function splitTextReducer(frag, text, index) {
	if (index % 2) { // Code is always in odd positions
		frag.append(styleInlineCode(text));
	} else if (text.length > 0) {
		frag.append(text);
	}

	return frag;
}

export default function () {
	const splittingRegex = /`(.*?)`/g;
	$('.tweet-text').each((i, el) => {
		const tweetWithBackticks = el.textContent.split(splittingRegex);

		if (tweetWithBackticks.length === 1) {
			return;
		}

		const frag = tweetWithBackticks.reduce(splitTextReducer, new DocumentFragment());
		$(el).html(frag);
	});
}
