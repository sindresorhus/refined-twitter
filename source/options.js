import OptionsSync from 'webext-options-sync';
import {groupedFeatures} from './features';

const element = document.querySelector('#features-placeholder');
const _groupedFeaturesEntries = Object.entries(groupedFeatures);
for (const [category, features] of _groupedFeaturesEntries) {
	// Hide category if it has only hidden configurations
	if (!features.find(feature => !feature.hidden)) {
		continue;
	}

	const section = document.createElement('section');

	const h4 = document.createElement('h4');
	h4.textContent = category.toUpperCase();
	section.append(h4);

	for (const feature of features) {
		const p = document.createElement('p');

		if (feature.hidden) {
			p.className = 'hidden-feature';
		}

		const label = document.createElement('label');

		const input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		input.setAttribute('name', feature.id);
		label.append(input);

		const labelText = document.createTextNode(` ${feature.label}`);
		label.append(labelText);

		p.append(label);
		section.append(p);
	}

	element.append(section);
}

new OptionsSync().syncForm('#options-form');
