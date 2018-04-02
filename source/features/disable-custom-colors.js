export default () => {
	if (document.body.classList.contains('ProfilePage')) {
		const userStyles = $('head')[0].querySelector('style');
		document.body.appendChild(userStyles);
	}
};
