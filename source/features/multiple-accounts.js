import { h } from 'dom-chef';
import { getUsername, getUserImage } from '../libs/utils';
const { sendMessage } = chrome.runtime;

function getAccessTokens() {
	return new Promise((res, rej) => {
		sendMessage({ message: "reqAccessToken" }, response => {
			res({token: response.token})
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
			token: data.token,
		}
	}))
}

function setLocalStorage() {
	const { localStorage } = window;

	return createUserData().then(userData => {
		console.log(userData)
		const existingAccounts = JSON.parse(localStorage.getItem("activeAccounts")) || {};
		const updatedAccounts = Object.assign(existingAccounts, userData);
		localStorage.setItem("activeAccounts", JSON.stringify(updatedAccounts));
	})
}

function getLocalStorage() {
	const { localStorage } = window;
	return JSON.parse(localStorage.getItem("activeAccounts"));
}

const createAccountNode = function () {
	const dropDownMenu = document.querySelector('.dropdown-menu > ul');

	setLocalStorage().then(_ => {
		const localStorage = getLocalStorage();
		const addAccount = (
			<li class="RT-addAccount">
				<button
					class="dropdown-link"
					onClick={() => {
						sendMessage({
							message: "rmAccessToken",
						});
					}}>
					+ Add Account
				</button>
			</li>
		);

		for (let user in localStorage ) {
			const {token, image} = localStorage[user];
			const profiles = (
				<li class="RT-user">
					<a
					onClick={() => {
						sendMessage({
							message: "setAccessToken",
							token,
						});
					}}>
						<img className="RT-user__image" src={image} />
						<span token={token} className="RT-user__name">{user}</span>
					</a>
				</li>
			)
			dropDownMenu.appendChild(profiles)
		}
		dropDownMenu.appendChild(addAccount)
	});


}

export default createAccountNode;
