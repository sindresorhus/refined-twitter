export default async () => {
	const imgContainers = document.querySelectorAll('.AdaptiveMedia-photoContainer, .Gallery-media');

	for (const imgContainer of imgContainers) {
		// Exit if it already exists
		if (imgContainer.querySelector('.refined-twitter_image-alt')) {
			continue;
		}

		const imgs = imgContainer.querySelectorAll('img');
		for (const img of imgs) {
			const imgAlt = img.getAttribute('alt');

			if(!imgAlt) {
				continue;
			}

			var altDiv = document.createElement('div');
			altDiv.className = 'refined-twitter_image-alt';
			altDiv.textContent = imgAlt;
			img.parentNode.prepend(altDiv);
		}
	}
};
