import {isProfilePage, getUsername} from '../libs/utils';

export default () => {
	const targetClass = `user-style-${getUsername()}`;
	if (isProfilePage() && !document.body.classList.contains(targetClass)) {
		const userStyles = document.getElementById(targetClass);
		document.body.append(userStyles);
	}
};
