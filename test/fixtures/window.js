'use strict';
const {URL} = require('url');

function WindowMock(initialURI = 'https://twitter.com') {
	this.location = new URL(initialURI);
}

module.exports = WindowMock;
