import pick from 'lodash.pick';
import debounce from 'lodash.debounce';

import {
	getFromLocalStorage,
	setToLocalStorage,
	observeEl
} from '../libs/utils';

export default function preserveTextMessages() {
	onDMModalOpenAndClose(
		handleConversationOpen,
		handleDMModalClose
	);

	// When the user deletes a conversation
	// remove it from local storage
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
				// This is necessary for `handleMessageChange` function
				setToLocalStorage({isDMModalOpen: false});

				handleDMModalClose();
				break;
			} else {
				// This is necessary for `handleMessageChange` function
				setToLocalStorage({isDMModalOpen: true});

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

	// When a user starts typing in a conversation
	// after the first time of opening the DM Modal
	// allow storing the message in the local storage by default.
	// see `handleMessageChange` to see where this boolean
	// is used and why
	let isDMModalOpen = true;

	// Start listening for when isDMModalOpen property in localstorage changes.
	// we need this to pass onto `handleMessageChange`.
	// see handleMessageChange definition to know why.
	browser.storage.onChanged.addListener((changes, area) => {
		if (area === 'local' && (changes.isDMModalOpen)) {
			isDMModalOpen = changes.isDMModalOpen.newValue;
		}
	});

	onMessageChange(() => handleMessageChange(isDMModalOpen));
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
	const range = document.createRange();
	const selection = window.getSelection();
	range.selectNodeContents(contentEditableElement);
	range.collapse(false);
	selection.removeAllRanges();
	selection.addRange(range);
}

function getConversationId() {
	return document.querySelector('.DMConversation').dataset.threadId;
}

function getMessageContainer() {
	return $('#tweet-box-dm-conversation');
}

function isEmptyMsgInput(message) {
	const messageEl = document.createElement('div');
	messageEl.innerHTML = message;
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

async function handleMessageChange(isDMModalOpen) {
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
	// in local storage. Otherwise the message will be lost.
	if (isDMModalOpen) {
		setToLocalStorage(updatedMessages);
	}
}

function fillContainerWithMessage(messageContainer, savedMessage) {
	messageContainer.empty();
	messageContainer.append(savedMessage);
	setCursorToEnd(messageContainer[0]);
}
