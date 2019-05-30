import elementReady from 'element-ready';

export default async function () {
	const sidebar = await elementReady('[data-testid=sidebarColumn]');
	$(sidebar).hide();
}
