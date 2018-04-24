export default async () => {
	const imgContainers = document.querySelectorAll('.AdaptiveMedia-photoContainer, .Gallery-media');

	for (const imgContainer of imgContainers) {
		// Exit if it already exists
		if (imgContainer.classList.contains('refined-twitter_image-alt')) {
			continue;
		}

		const imgs = imgContainer.querySelectorAll('img');
		for (const img of imgs) {
			const imgAlt = img.getAttribute('alt');

			if(!imgAlt) {
				continue;
			}

			imgContainer.classList.add('refined-twitter_image-alt_container');
			imgContainer.parentNode.classList.add('refined-twitter_image-alt_parent-container');

			var altDiv = document.createElement('div');
			altDiv.className = 'refined-twitter_image-alt';
			altDiv.textContent = imgAlt;
			img.parentNode.prepend(altDiv);

			img.classList.add('refined-twitter_image-alt_img');
		}
	}
};
