/**
 * This custom tokenizer for remark-parse is needed so that
 * hashtags (#refinedtwitter) and mentions (@sindresorhus) are
 * not sanitized when the markdown is compiled to HTML.
 */

tokenizeMentionAndHashtags.notInLink = true;
tokenizeMentionAndHashtags.locator = (value, fromIndex) => value.indexOf('@', fromIndex);

function tokenizeMentionAndHashtags(eat, value, silent) {
	const match = /^(@|#)(\w+)/.exec(value);

	if (match) {
		if (silent) {
			return true;
		}

		return eat(match[0])({
			type: 'link',
			url: 'https://social-network/' + match[1],
			children: [{type: 'text', value: match[0]}]
		});
	}
}

export default function mentionsAndHashtags() {
	const {Parser} = this;
	const tokenizers = Parser.prototype.inlineTokenizers;
	const methods = Parser.prototype.inlineMethods;

	// Add inline tokenizer.
	tokenizers.mention = tokenizeMentionAndHashtags;

	// Run it just before `text`.
	methods.splice(methods.indexOf('text'), 0, 'mention');
}
