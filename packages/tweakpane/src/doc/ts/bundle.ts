import {initBlades} from './route/blades';
import {initCatalog} from './route/catalog.js';
import {initGettingStarted} from './route/getting-started.js';
import {initIndex} from './route/index.js';
import {initInputBindings} from './route/input-bindings';
import {initMigrationDatgui} from './route/migration-datgui.js';
import {initMigrationV4} from './route/migration-v4.js';
import {initMisc} from './route/misc.js';
import {initMonitorBindings} from './route/monitor-bindings';
import {initPlugins} from './route/plugins';
import {initPluginsDev} from './route/plugins-dev';
import {initQuickTour} from './route/quick-tour.js';
import {initTheming} from './route/theming.js';
import {initUiComponents} from './route/ui-components';
import {SimpleRouter} from './simple-router.js';
import {SpMenu} from './sp-menu.js';

declare let hljs: any;

function setUpSpMenu() {
	const buttonElem: HTMLElement | null =
		document.getElementById('spMenuButton');
	const menuElem: HTMLElement | null = document.querySelector('.menu');
	if (!buttonElem || !menuElem) {
		return;
	}

	new SpMenu({
		buttonElement: buttonElem,
		menuElement: menuElem,
	});
}

function setUpVersionSwitcher() {
	const selectElem: HTMLSelectElement | null = document.querySelector(
		'.logoSwitcher select',
	);
	if (!selectElem) {
		return;
	}
	selectElem.value = '';

	if (location.hostname === 'localhost' && !location.search.includes('debug')) {
		selectElem.disabled = true;
	}

	selectElem.addEventListener('change', (ev) => {
		const href = (ev.currentTarget as HTMLSelectElement).value;
		if (href) {
			location.href = href;
		}
	});
}

(() => {
	const router = new SimpleRouter();
	router.add(/\/getting-started\/$/, initGettingStarted);
	router.add(/\/blades\/$/, initBlades);
	router.add(/\/catalog\.html$/, initCatalog);
	router.add(/\/input-bindings\/$/, initInputBindings);
	router.add(/\/misc\/$/, initMisc);
	router.add(/\/migration\/datgui\/$/, initMigrationDatgui);
	router.add(/\/migration\/v4\/$/, initMigrationV4);
	router.add(/\/monitor-bindings\/$/, initMonitorBindings);
	router.add(/\/theming\/$/, initTheming);
	router.add(/\/plugins\/dev\/$/, initPluginsDev);
	router.add(/\/plugins\/$/, initPlugins);
	router.add(/\/quick-tour\/$/, initQuickTour);
	router.add(/\/ui-components\/$/, initUiComponents);
	router.add(() => {
		return document.querySelector(':root.index') !== null;
	}, initIndex);
	router.route(location.pathname);

	setUpSpMenu();
	setUpVersionSwitcher();

	hljs.highlightAll();
})();
