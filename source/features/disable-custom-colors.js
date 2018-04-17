import {isProfilePage, getUsername} from '../libs/utils';

export default () => {
	const targetStyle = `user-style-${getUsername()}`;
	if (isProfilePage() && !document.body.classList.contains(targetStyle)) {
		const userStyles = document.getElementById(targetStyle);
		document.body.append(userStyles);
	}
};
