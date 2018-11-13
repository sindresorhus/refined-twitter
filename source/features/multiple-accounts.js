import {h} from 'dom-chef';
import {getUsername, getUserImage} from '../libs/utils';

const {sendMessage} = chrome.runtime;

function getAccessTokens() {
	return new Promise(resolve => {
		sendMessage({message: 'requestAccessToken'}, response => {
			resolve({token: response.token});
			return true;
		});
	}).catch(err => console.error(err));
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
	const dropDownMenu = document.querySelector('.dropdown-menu > ul');
	await setLocalStorage();
	const localStorage = getLocalStorage();
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

	for (const user of Object.entries(localStorage)) {
		const [username, data] = user;
		const {token, image} = data;
		const profiles = (
			<li class="refined-twitter_user">
				<a
				onClick={() => {
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
		dropDownMenu.append(profiles);
	}
	dropDownMenu.append(addAccount);
};
export default createAccountNode;
