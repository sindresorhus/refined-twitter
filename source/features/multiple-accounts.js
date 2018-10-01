import {h} from 'dom-chef';
import { getUsername, getUserImage } from '../libs/utils';

function accountAlreadyExist() {

}

function setLocalStorage(newAccount) {
	const { localStorage } = window;
	const existingAccounts = JSON.parse(localStorage.getItem("activeAccounts"));
	const updatedAccounts = Object.assign(existingAccounts, newAccount);

	localStorage.setItem("activeAccounts", JSON.stringify(updatedAccounts));
}

function getAccessTokens() {
	return new Promise((res, rej) => {
		chrome.runtime.sendMessage({ message: "reqAccessToken" }, function (response) {
			const { key, token } = response;
			res({ key, token })
			return true;
		});
	}).catch(e => e);
}

function createUserData(userName, userImage) {
	return getAccessTokens().then(data => ({
		[userName]: {
			key: data.key,
			token: data.token,
			userImage
		}
	}))
}

const multipleAccounts = function () {
	const userName = getUsername();
	const userImage = getUserImage();
	const dropDownMenu = document.querySelector('.dropdown-menu > ul');

	createUserData(userName, userImage).then(userData => {
		console.log(userData)
		const profiles = (
			<li class="user" onClick={() => { document.cookie = `${userData["Tomma5o"].key}=${userData["Tomma5o"].token}`; window.location.reload() }}>
				<img src={userData["Tomma5o"].userImage} />
				<span cookieKey={userData["Tomma5o"].key} cookieToken={userData["Tomma5o"].token}>{"Tomma5o"}</span>
			</li>
		)
		dropDownMenu.appendChild(profiles)
	});


}

export default multipleAccounts;

// https://pbs.twimg.com/profile_images/881262893836242946/r4czN0MR_normal.jpg
// https://pbs.twimg.com/profile_images/881262893836242946/r4czN0MR_400x400.jpg
