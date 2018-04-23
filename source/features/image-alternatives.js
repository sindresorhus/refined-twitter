export default async () => {
	const imgContainers = document.querySelectorAll('.AdaptiveMedia-photoContainer');

	for (let imgContainer of imgContainers) {
		// Exit if it already exists
		if (imgContainer.querySelector('.refined-twitter_alt')) {
			return;
		}

		const imgs = imgContainer.querySelectorAll('img');
		for (let img of imgs) {

			let imgAlt = img.getAttribute('alt');
			if(imgAlt) {
				var altDiv = document.createElement('div');
				altDiv.className = 'refined-twitter_alt';
				altDiv.textContent = imgAlt;
				img.parentNode.prepend(altDiv);
			}
		}
	}
};
