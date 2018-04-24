export default async () => {
	const imgContainers = document.querySelectorAll('.AdaptiveMedia-photoContainer, .Gallery-media');

	for (const imgContainer of imgContainers) {
		// Exit if it already exists
		// Test on content because a same container can be reused (Gallery)
		if (imgContainer.querySelector('.refined-twitter_image-alt')) {
			continue;
		}

		const imgs = imgContainer.querySelectorAll('img');
		for (const img of imgs) {
			const imgAlt = img.getAttribute('alt');

			if (!imgAlt) {
				continue;
			}

			imgContainer.classList.add('refined-twitter_image-alt_container');

			if (imgContainer.classList.contains('AdaptiveMedia-photoContainer')) {
				imgContainer.parentNode.classList.add('refined-twitter_image-alt_parent-container');
			}

			const altDiv = document.createElement('div');
			altDiv.className = 'refined-twitter_image-alt';
			altDiv.textContent = imgAlt;
			img.parentNode.prepend(altDiv);

			img.classList.add('refined-twitter_image-alt_img');
		}
	}
};
