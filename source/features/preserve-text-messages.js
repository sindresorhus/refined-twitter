import pick from 'lodash.pick';
import debounce from 'lodash.debounce';
import DOMPurify from 'dompurify';
import {
	getFromLocalStorage,
	setToLocalStorage,
	observeEl
} from '../libs/utils';

let isDMModalOpen = false;

export default function preserveTextMessages() {
	onDMModalOpenAndClose(
		handleConversationOpen,
		handleDMModalClose
	);

	// When the user deletes a conversation remove it from local storage
	onMessageDelete(() => removeMessages(idsOfNotDeletedMsgs));
}

function onMessageDelete(cb) {
	const messageDelMutatioOptions = {
		childList: true,
		subtree: true,
		attributes: true
	};

	observeEl('body', mutations => {
		for (const mutation of mutations) {
			if (mutation.target.id === 'confirm_dialog') {
				const deleteButton = $('#confirm_dialog_submit_button');

				const onDeleteButtonClick = () => {
					cb();
					deleteButton.off('click');
				};

				deleteButton.on('click', onDeleteButtonClick);
				break;
			}
		}
	}, messageDelMutatioOptions);
}

function onDMModalOpenAndClose(handleConversationOpen, handleDMModalClose) {
	observeEl('#dm_dialog', mutations => {
		for (const mutation of mutations) {
			if (mutation.target.style.display === 'none') {
				isDMModalOpen = false;

				handleDMModalClose();
				break;
			} else {
				isDMModalOpen = true;

				observeEl('.DMConversation', mutations => {
					for (const mutation of mutations) {
						if (mutation.target.classList.contains('DMActivity--open')) {
							handleConversationOpen();
							break;
						}
					}
				}, {attributes: true, attributeFilter: ['class']});

				break;
			}
		}
	}, {attributes: true});
}

function handleDMModalClose() {
	removeMessages(idsOfNonEmptyMsgs);
}

function onMessageChange(cb) {
	const msgChangeMutationOptions = {
		childList: true,
		subtree: true,
		characterData: true
	};

	observeEl('#tweet-box-dm-conversation', debounce(() => {
		cb();
	}, 150), msgChangeMutationOptions);
}

function handleConversationOpen() {
	restoreSavedMessage();

	onMessageChange(() => handleMessageChange());
}

async function removeMessages(refinedMsgIdsMaker) {
	const {messages: savedMessages} = await getFromLocalStorage('messages');

	if (!savedMessages) {
		return;
	}

	const idsOfMsgToReSave = refinedMsgIdsMaker(savedMessages);

	const updatedMessages = {
		messages: pick(savedMessages, idsOfMsgToReSave)
	};

	setToLocalStorage(updatedMessages);
}

function idsOfNonEmptyMsgs(savedMessages) {
	return Object.keys(savedMessages)
		.filter(id => !isEmptyMsgInput(savedMessages[id]));
}

function idsOfNotDeletedMsgs(savedMessages) {
	return Object.keys(savedMessages)
		.filter(id => id !== getConversationId());
}

// See: https://gist.github.com/al3x-edge/1010364
function setCursorToEnd(contentEditableElement) {
	window.requestAnimationFrame(() => {
		const range = document.createRange();
		const selection = window.getSelection();
		range.selectNodeContents(contentEditableElement);
		range.collapse(false);
		selection.removeAllRanges();
		selection.addRange(range);
	});
}

function getConversationId() {
	return document.querySelector('.DMConversation').dataset.threadId;
}

function getMessageContainer() {
	return $('#tweet-box-dm-conversation');
}

function isEmptyMsgInput(message) {
	const messageEl = document.createElement('div');
	messageEl.innerHTML = DOMPurify.sanitize(message);
	return messageEl.textContent === '';
}

async function restoreSavedMessage() {
	const conversationId = getConversationId();
	const messageContainer = getMessageContainer();
	if (conversationId) {
		const {messages: savedMessages} = await getFromLocalStorage('messages');

		if (!savedMessages) {
			return;
		}

		const {[conversationId]: savedMessage} = savedMessages;

		if (savedMessage && !isEmptyMsgInput(savedMessage)) {
			console.log('prefilling contentEditableElement with savedMessage');
			fillContainerWithMessage(messageContainer, savedMessage);
		}
	}
}

async function handleMessageChange() {
	const conversationId = getConversationId();
	const currentMessage = getMessageContainer().html();
	const {messages: savedMessages} = await getFromLocalStorage('messages');

	const updatedMessages = {
		messages: Object.assign((savedMessages || {}), {[conversationId]: currentMessage})
	};

	// We need to check if DM Modal is open because
	// twitter unsets the message when DMModal closes.
	// Hence we need a way to tell handleMessageChange
	// to not store empty message (which happens when DMModal closes)
	if (isDMModalOpen) {
		setToLocalStorage(updatedMessages);
	}
}

function fillContainerWithMessage(messageContainer, savedMessage) {
	messageContainer.empty();
	messageContainer.append(savedMessage);
	setCursorToEnd(messageContainer[0]);
}
