import pick from 'lodash.pick';

import {
	getFromLocalStorage,
	setToLocalStorage
} from '../libs/utils';

export async function removeMessages(refinedMsgIdsMaker) {
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

export function idsOfNonEmptyMsgs(savedMessages) {
	return Object.keys(savedMessages)
		.filter(id => !isEmptyMsgInput(savedMessages[id]));
}

export function idsOfNotDeletedMsgs(savedMessages) {
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

export async function restoreSavedMessage() {
	const conversationId = getConversationId();
	const messageContainer = getMessageContainer();
	if (conversationId) {
		const {messages: savedMessages} = await getFromLocalStorage('messages');

		if (!savedMessages) {
			return;
		}

		const {[conversationId]: savedMessage} = savedMessages;

		if (savedMessage && !isEmptyMsgInput(savedMessage)) {
			fillContainerWithMessage(messageContainer, savedMessage);
		}
	}
}

export async function handleMessageChange(isDMModalOpen) {
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
