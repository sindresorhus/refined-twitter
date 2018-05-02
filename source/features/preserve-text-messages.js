import debounce from 'lodash.debounce';
import pick from 'lodash.pick';

import {
	observeEl,
	getFromLocalStorage,
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

		/** If Direct message modal is not open (hence also when it gets closed); */
		if (!DMDialogOpen) {
			const {messages: savedMessages} = await getFromLocalStorage('messages');

			if (!savedMessages) {
				return;
			}

			// Select messages which are not empty
			const idsOfMgsToSave = Object.keys(savedMessages)
				.filter(id => !isEmptyMsgInput(savedMessages[id]));

			// Empty messages are discarded before re write to local storage
			const updatedMessages = {
				messages: pick(savedMessages, idsOfMgsToSave)
			};

			setToLocalStorage(updatedMessages);
		}
	}, {attributes: true});
}

function onDMOpen() {
	const DMOpenMutationOptions = {
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
	}, DMOpenMutationOptions);
}

/** When someone deletes the message; remove it from localstorage */
export function onDMDelete() {
	const DMDeleteMutationOptions = {
		childList: true,
		subtree: true,
		attributes: true
	};

	observeEl('body', async mutations => {
		const {messages: savedMessages} = await getFromLocalStorage('messages');

		if (!savedMessages) {
			return;
		}

		for (const mutation of mutations) {
			if (mutation.target.id === 'confirm_dialog') {
				const conversationId = getConversationId();
				$('#confirm_dialog_submit_button').on('click', () => {
					// Get all the ids of messages that are not being deleted
					const idsOfMsgToReSave = Object.keys(savedMessages)
						.filter(id => id !== conversationId);

					const updatedMessages = {
						messages: pick(savedMessages, idsOfMsgToReSave)
					};

					setToLocalStorage(updatedMessages);
				});

				break;
			}
		}
	}, DMDeleteMutationOptions);
}

async function fetchStoredMessage(conversationId, messageContainer) {
	const {messages: savedMessages} = await getFromLocalStorage('messages');
	if (!savedMessages) {
		return;
	}
	const {[conversationId]: savedMessage} = savedMessages;

	if (savedMessage && !isEmptyMsgInput(savedMessage)) {
    messageContainer.empty();
    messageContainer.append(savedMessage);
    setCursorToEnd(messageContainer[0]);
	}
}

function onMessageChange(messageContainer) {
	const messageMutationOptions = {
		childList: true,
		subtree: true,
		characterData: true
	};

	observeEl(DMTextBoxSelector, debounce(async () => {
		const conversationId = getConversationId();
		const currentMessage = messageContainer.html();

		// Read the messages to merge them to the latest
		const {messages: savedMessages} = await getFromLocalStorage('messages');

		const updatedMessages = {
			messages: Object.assign(savedMessages || {}, {[conversationId]: currentMessage})
		};

		if (DMDialogOpen) {
      setToLocalStorage(updatedMessages);
		}
	}, 150), messageMutationOptions);
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
