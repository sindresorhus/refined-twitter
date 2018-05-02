import debounce from 'lodash.debounce';
import {
	observeEl,
	getFromLocalStorage,
	removeFromLocalStorage,
	setToLocalStorage
} from '../libs/utils';

let DMDialogOpen = false;

const DMModalSelector = '#dm_dialog';
const DMConversationSelector = '.DMConversation';
const DMTextBoxSelector = '#tweet-box-dm-conversation';

export async function onDMDialogOpen() {
	observeEl(DMModalSelector, async mutations => {
		for (const mutation of mutations) {
			if (mutation.target.style.display === 'none') {
				DMDialogOpen = false;
			} else {
				DMDialogOpen = true;
				onDMOpen();
			}
		}

		if (!DMDialogOpen) {
			const savedMessages = await getFromLocalStorage();

			const idsOfMgsToRemove = Object.keys(savedMessages)
				.filter(id => isEmptyMsgInput(savedMessages[id]));

			removeFromLocalStorage(idsOfMgsToRemove);
		}
	}, {attributes: true});
}

function onDMOpen() {
	const conversationOptions = {
		attributes: true,
		attributeFilter: ['class']
	};

	observeEl(DMConversationSelector, mutations => {
		let conversationId;
		let messageContainer;

		for (const mutation of mutations) {
			if (mutation.target.classList.contains('DMActivity--open')) {
				conversationId = getConversationId();
				messageContainer = $(DMTextBoxSelector);
				if (conversationId) {
          fetchStoredMessage(conversationId, messageContainer);
          onMessageChange(messageContainer);
				}
			}
			break;
		}
	}, conversationOptions);
}

export function onDMDelete() {
	observeEl('body', async mutations => {
		const savedMessages = await getFromLocalStorage();
		const pendingRemoval = [];

		for (const mutation of mutations) {
			if (mutation.target.id === 'confirm_dialog') {
				const conversationId = getConversationId();
				$('#confirm_dialog_submit_button').on('click', () => {
					savedMessages
						.filter(id => conversationId === id)
						.forEach(() => {
              pendingRemoval.push(browser.storage.local.remove(conversationId));
						});
				});

				break;
			}
		}

		await Promise.all(pendingRemoval);
	}, {childList: true, subtree: true, attributes: true});
}

async function fetchStoredMessage(conversationId, messageContainer) {
	const {[conversationId]: savedMessage} = await getFromLocalStorage(conversationId);
	if (savedMessage && !isEmptyMsgInput(savedMessage)) {
    messageContainer.empty();
    messageContainer.append(savedMessage);
    setCursorToEnd(messageContainer[0]);
	}
}

function onMessageChange(messageContainer) {
	const messageOptions = {
		childList: true,
		subtree: true,
		characterData: true
	};

	observeEl(DMTextBoxSelector, debounce(async () => {
		const conversationId = getConversationId();
		const currentMessage = messageContainer.html();
		const message = {
			[conversationId]: currentMessage
		};

		if (DMDialogOpen) {
      setToLocalStorage(message);
		}
	}, 150), messageOptions);
}

// See: https://gist.github.com/al3x-edge/1010364
function setCursorToEnd(contentEditableElement) {
	const range = document.createRange();
	const selection = window.getSelection();
  range.selectNodeContents(contentEditableElement);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function getConversationId() {
	return document.querySelector('.DMConversation').dataset.threadId;
}

function isEmptyMsgInput(message) {
	const messageEl = document.createElement('div');
	messageEl.innerHTML = message;
	return messageEl.textContent === '';
}
