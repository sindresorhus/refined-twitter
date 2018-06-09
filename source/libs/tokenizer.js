/**
 * This custom tokenizer for remark-parse is needed so that
 * hashtags (#refinedtwitter) and mentions (@sindresorhus) are
 * not sanitized when the markdown is compiled to HTML.
 */

function mentions(eat, value, silent) {
	const match = /^@(\w+)/.exec(value);

	if (match) {
		if (silent) {
			return true;
		}

		console.log(match);
		return eat(match[0])({
			type: 'link',
			url: 'https://twitter.com/' + match[1],
			children: [{type: 'text', value: match[0]}]
		});
	}
}

mentions.notInLink = true;
mentions.locator = (value, fromIndex) =>
	value.indexOf('@', fromIndex);

function hashTags(eat, value, silent) {
	const match = /^#(\w+)/.exec(value);

	if (match) {
		if (silent) {
			return true;
		}

		console.log(match);
		return eat(match[0])({
			type: 'link',
			url: 'https://twitter.com/hashtag/' + match[1],
			children: [{type: 'text', value: match[0]}]
		});
	}
}

hashTags.notInLink = true;
hashTags.locator = (value, fromIndex) =>
	value.indexOf('#', fromIndex);

export default function () {
	const {Parser} = this;
	const tokenizers = Parser.prototype.inlineTokenizers;
	const methods = Parser.prototype.inlineMethods;

	// Add inline tokenizer.
	tokenizers.mention = mentions;
	tokenizers.hashTag = hashTags;

	// Run it just before `text`.
	methods.splice(methods.indexOf('text'), 0, 'mention');
	methods.splice(methods.indexOf('text'), 0, 'hashTag');
}
