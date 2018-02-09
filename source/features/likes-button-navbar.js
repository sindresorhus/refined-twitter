import {h} from 'dom-chef';

export default function () {
	const globalActionsList = $('#global-actions');

	if (globalActionsList.find('.refined-like-button').length > 0) {
		return;
	}

	globalActionsList.append(
		<li>
			<a role="button" data-nav="favorites" href="/i/likes" class="js-nav js-tooltip js-dynamic-tooltip refined-like-button" data-placement="bottom">
				<span class="Icon Icon--heart Icon--large"></span>
				<span class="text">Likes</span>
			</a>
		</li>
	);
}
