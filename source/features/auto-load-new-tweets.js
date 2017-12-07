import {observeEl} from '../libs/utils';

export default function () {
	const el = $('.stream-container .stream-item')[0];

	observeEl(el, () => {
		const threshold = 20;
		const offsetY = document.body.getBoundingClientRect().top;
		if (offsetY <= -threshold) {
			return;
		}

		$('.new-tweets-bar', el).click();
	});
}
