import debounce from 'lodash.debounce';
import {observeEl} from '../libs/utils';

let DMDialogOpen = false;

function onDMDialogOpen() {
	observeEl('#dm_dialog', async mutations => {
		for (const mutation of mutations) {
			if (mutation.target.style.display === 'none') {
				DMDialogOpen = false;
			} else {
				DMDialogOpen = true;
				onDMOpen();
			}
		}

		if (!DMDialogOpen) {
			const savedMessages = await browser.storage.local.get();
			const idsOfMessagesToRemove = [];

			for (const id in savedMessages) {
				if (isEmptyMsgInput(savedMessages[id])) {
					idsOfMessagesToRemove.push(id);
				}
			}

			await browser.storage.local.remove(idsOfMessagesToRemove);
		}
	}, {attributes: true});
}

function onDMOpen() {
	const conversationOptions = {
		attributes: true,
		attributeFilter: ['class']
	};

	observeEl('.DMConversation', mutations => {
		let conversationId;
		let messageContainer;

		for (const mutation of mutations) {
			if (mutation.target.classList.contains('DMActivity--open')) {
				conversationId = getConversationId();
				messageContainer = $('#tweet-box-dm-conversation');
				if (conversationId) {
					onMessageChange(messageContainer);
				}
			}
			if (conversationId) {
				fetchStoredMessage(conversationId, messageContainer);
			}
		}
	}, conversationOptions);
}

async function fetchStoredMessage(conversationId, messageContainer) {
	try {
		const {[conversationId]: savedMessage} = await browser.storage.local.get(conversationId);

		if (savedMessage && !isEmptyMsgInput(savedMessage)) {
			messageContainer.empty();
			messageContainer.append(savedMessage);
			setCursorToEnd(messageContainer[0]);
		}
	} catch (e) {
			console.error(
				`An error occured while fetching ${conversationId}'s stored message
				or while restoring already saved message: ${e}`
			);
	}
}

function onMessageChange(messageContainer) {
	const messageOptions = {
		childList: true,
		subtree: true,
		characterData: true
	};

	observeEl('#tweet-box-dm-conversation', debounce(async () => {
		const conversationId = getConversationId();
		const currentMessage = messageContainer.html();
		const message = {
			[conversationId]: currentMessage
		};

		if (DMDialogOpen) {
			try {
				await browser.storage.local.set(message);
			} catch (e) {
				console.error(`Error in storing ${conversationId}'s message`);
			}
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
	return message === '<div><br></div>' || message === '<br>';
}

export default onDMDialogOpen;
