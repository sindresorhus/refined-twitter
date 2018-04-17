import {isProfilePage, getUsername} from '../libs/utils';

export default () => {
	if (isProfilePage()) {
		const userStyles = document.getElementById(`user-style-${getUsername()}`);
		document.body.append(userStyles);
	}
};
