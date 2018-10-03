import { h } from 'dom-chef';
import { getUsername, getUserImage } from '../libs/utils';

function getAccessTokens() {
	return new Promise((res, rej) => {
		chrome.runtime.sendMessage({ message: "reqAccessToken" }, function (response) {
			const { key, token } = response;
			res({ key, token })
			return true;
		});
	}).catch(e => e);
}

function createUserData() {
	const userName = getUsername();
	const userImage = getUserImage();

	return getAccessTokens().then(data => ({
		[userName]: {
			image: userImage,
			key: data.key,
			token: data.token,
		}
	}))
}

function setLocalStorage() {
	const { sessionStorage } = window;

	return createUserData().then(userData => {
		console.log(userData)
		/**
		 * @todo diff different cookie after and beforee
		 * the modifid data
		 */
		const existingAccounts = JSON.parse(sessionStorage.getItem("activeAccounts")) || {};
		const updatedAccounts = Object.assign(existingAccounts, userData);
		sessionStorage.setItem("activeAccounts", JSON.stringify(updatedAccounts));
	})
}

function getLocalStorage() {
	const { sessionStorage } = window;
	return JSON.parse(sessionStorage.getItem("activeAccounts"));
}

const createAccountNode = function () {
	const dropDownMenu = document.querySelector('.dropdown-menu > ul');

	setLocalStorage().then(_ => {
		const currentLocalStorage = getLocalStorage();
		for (let user in currentLocalStorage ) {
			const {key, token, image} = currentLocalStorage[user];
			const profiles = (
				<li class="RT-user"
					onClick={() => {
						chrome.runtime.sendMessage({
							message: "setAccessToken",
							cookieValue: token
						});
					}}>
					<img className="RT-user__image" src={image} />
					<span className="RT-user__name">{user}</span>
				</li>
			)
			dropDownMenu.appendChild(profiles)
		}
	});


}

// export default setLocalStorage;
export default createAccountNode;

// https://pbs.twimg.com/profile_images/881262893836242946/r4czN0MR_normal.jpg
// https://pbs.twimg.com/profile_images/881262893836242946/r4czN0MR_400x400.jpg
