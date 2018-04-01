import {h} from 'dom-chef';

function styleInlineCode(md) {
	return (
		<code class="refined-twitter_markdown">
			{md}
		</code>
	);
}

function isElement(el) {
	return el instanceof HTMLElement;
}

function splitTextReducer(frag, text, index) {
	if (index % 2 && text.length >= 1) { // Code is always in odd positions
		frag.append(styleInlineCode(text));
	} else if (text.length > 0) {
		frag.append(text);
	}

	return frag;
}

export default function () {
	const splittingRegex = /`(.*?)`/g;

	$('.tweet-text').each((i, el) => {
		// Get everything in tweet
		const contents = Object.values($(el).contents());
		const text = contents.map(node => node.nodeValue || node);
		text.splice(-2); // Remove extraneous elements

		const frag = text.map(val => {
			// Style the single backticks while ignoring the already styled multiline code blocks
			if (isElement(val)) {
				return val;
			}
			return val.split(splittingRegex).reduce(splitTextReducer, new DocumentFragment());
		});

		const flattened = Array.prototype.concat.apply([], frag);
		$(el).html(flattened);
	});
}
