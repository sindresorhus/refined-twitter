import {h} from 'dom-chef';
import {
	getUsername,
	getUserImage,
	getFromLocalStorage,
	setToLocalStorage,
	removeInLocalStorage
} from '../libs/utils';

const {sendMessage} = browser.runtime;

function getAccessTokens() {
	return new Promise(resolve => {
		sendMessage({message: 'requestAccessToken'}).then(response => {
			resolve({token: response.token});
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

async function initStorage() {
	const userData = await createUserData();
	const usersStoredData = await getFromLocalStorage('activeAccounts');
	let updatedAccounts = {};

	if (usersStoredData.activeAccounts) {
		updatedAccounts = Object.assign(usersStoredData.activeAccounts, userData);
		setToLocalStorage({activeAccounts: updatedAccounts});
	} else {
		updatedAccounts = {activeAccounts: userData};
		setToLocalStorage(updatedAccounts);
	}
}

const createAccountNode = async function () {
	await initStorage();
	const {activeAccounts} = await getFromLocalStorage('activeAccounts');
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

	for (const user of Object.entries(activeAccounts)) {
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
					<span
						onClick={e => {
							e.stopPropagation();
							e.target.parentNode.style = 'display: none !important';
							removeInLocalStorage('activeAccounts', username);
						}}
						class="refined-twitter_user__delete"
					/>
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
