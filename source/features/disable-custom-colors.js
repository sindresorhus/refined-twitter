import {isProfilePage, isOwnProfilePage, getUsername} from '../libs/utils';

export default () => {
	if (isProfilePage() && !isOwnProfilePage()) {
		// An override class is created and persists temporarily after you change your color theme.
		const overrideSelector = `#user-style-override-${getUsername()}`;
		const targetSelector = `#user-style-${getUsername()}`;
		const userStyles = document.querySelector(overrideSelector) || document.querySelector(targetSelector);
		document.body.append(userStyles);
	}
};
