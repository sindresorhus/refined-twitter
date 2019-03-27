const toggleNightMode = () => {
	const nightmodeToggle = document.querySelector('.nightmode-toggle');
	if (nightmodeToggle) {
		nightmodeToggle.click();
	}
};

export default () => {
	const customShortcuts = [
		{
			name: 'Actions',
			description: 'Shortcuts for common actions.',
			shortcuts: [
				{
					keys: [
						'Alt',
						'm'
					],
					description: 'Toggle Night Mode'
				}
			]
		},
		{
			name: 'Navigation',
			description: 'Shortcuts for navigating between items in timelines.',
			shortcuts: []
		},
		{
			name: 'Timelines',
			description: 'Shortcuts for navigating to different timelines or pages.',
			shortcuts: []
		}
	];

	document.addEventListener('keydown', event => {
		const keyName = event.key;
		switch (keyName) {
			case 'µ': {
				toggleNightMode();
				break;
			}

			case 'm': {
				if (event.altKey) {
					toggleNightMode();
				}

				break;
			}

			default:
				break;
		}
	});

	const initDataElement = document.querySelector('#init-data');
	if (initDataElement) {
		const initData = JSON.parse(initDataElement.value);
		const updatedShortcuts = [...initData.keyboardShortcuts];
		for (const [i, item] of updatedShortcuts.entries()) {
			item.shortcuts = item.shortcuts.concat(customShortcuts[i].shortcuts);
		}

		initData.keyboardShortcuts = updatedShortcuts;
		initDataElement.value = JSON.stringify(initData);
	}
};
