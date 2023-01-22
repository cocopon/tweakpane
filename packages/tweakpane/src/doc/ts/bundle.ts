import {initBlades} from './route/blades';
import {initCatalog} from './route/catalog';
import {initGettingStarted} from './route/getting-started';
import {initIndex} from './route/index';
import {initInputBindings} from './route/input-bindings';
import {initMigration} from './route/migration';
import {initMisc} from './route/misc';
import {initMonitorBindings} from './route/monitor-bindings';
import {initPlugins} from './route/plugins';
import {initQuickTour} from './route/quick-tour';
import {initTheming} from './route/theming';
import {initUiComponents} from './route/ui-components';
import {Screw} from './screw';
import {SimpleRouter} from './simple-router';
import {SpMenu} from './sp-menu';

declare let hljs: any;

function setUpScrews() {
	const screwElems = document.querySelectorAll('.logo_symbol');
	screwElems.forEach((elem: Element) => {
		new Screw(elem as HTMLElement);
	});
}

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

(() => {
	const router = new SimpleRouter();
	router.add(/\/getting-started\/$/, initGettingStarted);
	router.add(/\/blades\/$/, initBlades);
	router.add(/\/catalog\.html$/, initCatalog);
	router.add(/\/input-bindings\/$/, initInputBindings);
	router.add(/\/misc\/$/, initMisc);
	router.add(/\/migration\/$/, initMigration);
	router.add(/\/monitor-bindings\/$/, initMonitorBindings);
	router.add(/\/theming\/$/, initTheming);
	router.add(/\/plugins\/$/, initPlugins);
	router.add(/\/quick-tour\/$/, initQuickTour);
	router.add(/\/ui-components\/$/, initUiComponents);
	router.add(() => {
		return document.querySelector(':root.index') !== null;
	}, initIndex);
	router.route(location.pathname);

	setUpScrews();
	setUpSpMenu();

	hljs.initHighlightingOnLoad();
})();
