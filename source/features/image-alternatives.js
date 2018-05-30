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
				const ancestor1 = imgContainer.parentNode;
				ancestor1.classList.add('refined-twitter_image-alt_photocontainer');
				if (ancestor1.parentNode.classList.contains('AdaptiveMedia-container')) {
					const ancestor2 = ancestor1.parentNode;
					if (ancestor2.parentNode.classList.contains('is-square')) {
						ancestor2.parentNode.classList.add('refined-twitter_image-alt_ancestor-not-square');
					}
				}
			}

			const altDiv = document.createElement('div');
			altDiv.textContent = imgAlt;

			if (imgContainer.classList.contains('Gallery-media')) {
				altDiv.className = 'refined-twitter_image-alt refined-twitter_image-alt_top';
				img.parentNode.prepend(altDiv);
			} else {
				altDiv.className = 'refined-twitter_image-alt refined-twitter_image-alt_bottom';
				img.parentNode.append(altDiv);
			}

			img.classList.add('refined-twitter_image-alt_img');
		}
	}
};
