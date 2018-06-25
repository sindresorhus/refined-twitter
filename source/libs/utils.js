import {h} from 'dom-chef';
import select from 'select-dom';
import elementReady from 'element-ready';
import domLoaded from 'dom-loaded';

/**
 * Prevent fn's errors from blocking the remaining tasks.
 * https://github.com/sindresorhus/refined-github/issues/678
 * The code looks weird but it's synchronous and fn is called without args.
 */
export const safely = async fn => fn();

/**
 * Automatically stops checking for an element to appear once the DOM is ready.
 */
export const safeElementReady = selector => {
	const waiting = elementReady(selector);

	// Don't check ad-infinitum
	domLoaded.then(() => requestAnimationFrame(() => waiting.cancel()));

	// If cancelled, return null like a regular select() would
	return waiting.catch(() => null);
};

export const observeEl = (el, listener, options = {childList: true}) => {
	if (typeof el === 'string') {
		el = select(el);
	}

	if (!el) {
		return;
	}

	// Run first
	listener([]);

	// Run on updates
	const observer = new MutationObserver(listener);
	observer.observe(el, options);
	return observer;
};

export const domify = html => {
	const div = document.createElement('div');
	div.innerHTML = html;
	return div;
};

export const getUsername = () => document.querySelector('.DashUserDropdown-userInfo .username > b').textContent;

export const isModalOpen = () => {
	const hasPermalinkOverlay = $('#permalink-overlay').is(':visible');
	const isDMModalOpen = $('#dm_dialog').is(':visible');
	return hasPermalinkOverlay || isDMModalOpen;
};

export const isProfilePage = () => document.body.classList.contains('ProfilePage');

export const isOwnProfilePage = () => isProfilePage() && document.body.classList.contains(`user-style-${getUsername()}`);

export const getFromLocalStorage = value => {
	try {
		return browser.storage.local.get(value);
	} catch (error) {
		console.error(`Error while fetching ${value ? JSON.stringify(value, null, '\t') : 'everything'}: ${error}`);
	}
};

export const setToLocalStorage = async value => {
	try {
		await browser.storage.local.set(value);
	} catch (error) {
		console.error(`Error in storing ${JSON.stringify(value, null, '\t')} to local storage: ${error}`);
	}
};
