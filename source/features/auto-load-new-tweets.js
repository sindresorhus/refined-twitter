import {observeEl, isModalOpen} from '../libs/utils';

export default function () {
	const el = $('.stream-container .stream-item')[0];

	observeEl(el, () => {
		if (isModalOpen()) {
			return;
		}

		const threshold = 20;
		const offsetY = document.body.getBoundingClientRect().top;

		if (offsetY <= -threshold) {
			return;
		}

		$('.new-tweets-bar', el).click();
	});
}
