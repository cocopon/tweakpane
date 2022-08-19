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
	router.add(/^(\/tweakpane)?\/getting-started\.html$/, initGettingStarted);
	router.add(/^(\/tweakpane)?\/$/, initIndex);
	router.add(/^(\/tweakpane)?\/blades\.html$/, initBlades);
	router.add(/^(\/tweakpane)?\/catalog\.html$/, initCatalog);
	router.add(/^(\/tweakpane)?\/input-bindings\.html$/, initInputBindings);
	router.add(/^(\/tweakpane)?\/misc\.html$/, initMisc);
	router.add(/^(\/tweakpane)?\/migration\.html$/, initMigration);
	router.add(/^(\/tweakpane)?\/monitor-bindings\.html$/, initMonitorBindings);
	router.add(/^(\/tweakpane)?\/theming\.html$/, initTheming);
	router.add(/^(\/tweakpane)?\/plugins\.html$/, initPlugins);
	router.add(/^(\/tweakpane)?\/quick-tour\.html$/, initQuickTour);
	router.add(/^(\/tweakpane)?\/ui-components\.html$/, initUiComponents);
	router.route(location.pathname);

	setUpScrews();
	setUpSpMenu();

	hljs.initHighlightingOnLoad();
})();
