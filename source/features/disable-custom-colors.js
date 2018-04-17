import {isProfilePage, getUsername} from '../libs/utils';

export default () => {
	const targetClass = `user-style-${getUsername()}`;
	if (isProfilePage() && !document.body.classList.contains(targetClass)) {
		// An override class is created and persists temporarily after you change your color theme.
		const override = `user-style-override-${getUsername()}`;
		const userStyles = document.getElementById(override) || document.getElementById(targetClass);
		document.body.append(userStyles);
	}
};
