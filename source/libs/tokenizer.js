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

		const [mention, base] = match;
		return eat(mention)({
			type: 'link',
			url: `https://twitter.com/${base}`,
			children: [{type: 'text', value: mention}]
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
		const [hashtag, base] = match;
		return eat(hashtag)({
			type: 'link',
			url: `https://twitter.com/hashtag/${base}`,
			children: [{ type: 'text', value: hashtag }]
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
