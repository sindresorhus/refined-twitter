import {h} from 'dom-chef';
import {getUsername, getUserImage} from '../libs/utils';

const {sendMessage} = chrome.runtime;

function getAccessTokens() {
	return new Promise(resolve => {
		sendMessage({message: 'requestAccessToken'}, response => {
			resolve({token: response.token});
			return true;
		});
	}).catch(error => console.error(error));
}

async function createUserData() {
	const userName = getUsername();
	const userImage = getUserImage();
	const data = await getAccessTokens();

	return {
		[userName]: {
			image: userImage,
			token: data.token
		}
	};
}

async function setLocalStorage() {
	const {localStorage} = window;
	const userData = await createUserData();
	const existingAccounts = JSON.parse(localStorage.getItem('activeAccounts')) || {};
	const updatedAccounts = Object.assign(existingAccounts, userData);

	localStorage.setItem('activeAccounts', JSON.stringify(updatedAccounts));
}

function getLocalStorage() {
	const {localStorage} = window;
	return JSON.parse(localStorage.getItem('activeAccounts'));
}

const createAccountNode = async function () {
	await setLocalStorage();
	const localStorage = getLocalStorage();
	const dropDownMenu = document.querySelector('.dropdown-menu > ul .DashUserDropdown-userInfo');
	const divider = document.querySelector('.dropdown-menu > ul .dropdown-divider').cloneNode();
	const addAccount = (
		<li class="refined-twitter_addAccount">
			<button
				class="dropdown-link"
				onClick={() => {
					sendMessage({
						message: 'removeAccessToken'
					});
				}}>
				+ Add Account
			</button>
		</li>
	);

	dropDownMenu.insertAdjacentElement('afterend', addAccount);

	for (const user of Object.entries(localStorage)) {
		const [username, data] = user;
		const {token, image} = data;
		const currentUserName = getUsername();

		const profile = (
			<li class="refined-twitter_user">
				<a onClick={() => {
					sendMessage({
						message: 'setAccessToken',
						token
					});
				}}>
					<img class="refined-twitter_user__image" src={image} />
					<span token={token} class="refined-twitter_user__name">{username}</span>
				</a>
			</li>
		);
		if (username !== currentUserName) {
			dropDownMenu.insertAdjacentElement('afterend', profile);
		}
	}

	dropDownMenu.insertAdjacentElement('afterend', divider);
};
export default createAccountNode;
