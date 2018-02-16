export default async () => {
	const customShortcuts = [
		{
			name: 'Actions',
			description: 'Shortcuts for common actions.',
			shortcuts: [
				{
					keys: [
						'Ctrl',
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
			case event.ctrlKey && 'm':
				if (document.querySelector('.nightmode-toggle')) {
					document.querySelector('.nightmode-toggle').click();
				}
				break;
			default:
				break;
		}
	});

	if (document.querySelector('#init-data')) {
		const initData = JSON.parse(document.querySelector('#init-data').value);
		const updatedShortcuts = initData.keyboardShortcuts;
		for (let i = 0; i < updatedShortcuts.length; i++) {
			updatedShortcuts[i].shortcuts = updatedShortcuts[i].shortcuts.concat(customShortcuts[i].shortcuts);
		}
		initData.keyboardShortcuts = updatedShortcuts;
		document.querySelector('#init-data').value = JSON.stringify(initData);
	}
};
