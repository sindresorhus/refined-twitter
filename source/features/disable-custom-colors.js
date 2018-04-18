import {isProfilePage, isOwnProfilePage, getUsername} from '../libs/utils';

export default () => {
	if (isProfilePage() && !isOwnProfilePage()) {
		// An override class is created and persists temporarily after you change your color theme.
		const override = `user-style-override-${getUsername()}`;
		const targetClass = `user-style-${getUsername()}`;
		const userStyles = document.getElementById(override) || document.getElementById(targetClass);
		document.body.append(userStyles);
	}
};
