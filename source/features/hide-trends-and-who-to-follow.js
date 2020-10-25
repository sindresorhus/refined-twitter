import elementReady from 'element-ready';

export default async function () {
	const trending = await elementReady('[aria-labelledby="accessible-list-0"]');
	$(trending).hide();
	const whoToFollow = await elementReady('[class="css-1dbjc4n r-1u4rsef r-9cbz99 r-1867qdf r-1phboty r-rs99b7 r-ku1wi2 r-1bro5k0 r-1udh08x"]');
	$(whoToFollow).hide();
}
