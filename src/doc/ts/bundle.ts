import {initCatalog} from './route/catalog';
import {initGettingStarted} from './route/getting-started';
import {initIndex} from './route/index';
import {initInput} from './route/input';
import {initMisc} from './route/misc';
import {initMonitor} from './route/monitor';
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
	const buttonElem: HTMLElement | null = document.getElementById(
		'spMenuButton',
	);
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
	router.add(/\/getting-started\.html$/, initGettingStarted);
	router.add(/\/$/, initIndex);
	router.add(/\/catalog\.html$/, initCatalog);
	router.add(/\/input\.html$/, initInput);
	router.add(/\/misc\.html$/, initMisc);
	router.add(/\/monitor\.html$/, initMonitor);
	router.add(/\/theming\.html$/, initTheming);
	router.add(/\/plugins\.html$/, initPlugins);
	router.add(/\/quick-tour\.html$/, initQuickTour);
	router.add(/\/ui-components\.html$/, initUiComponents);
	router.route(location.pathname);

	setUpScrews();
	setUpSpMenu();

	hljs.initHighlightingOnLoad();
})();
