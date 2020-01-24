import {IndexRoute} from './route/index';
import {InputRoute} from './route/input';
import {MiscRoute} from './route/misc';
import {MonitorRoute} from './route/monitor';
import {SimpleRouter} from './simple-router';

declare let hljs: any;

(() => {
	const router = new SimpleRouter();
	router.add(IndexRoute);
	router.add(InputRoute);
	router.add(MiscRoute);
	router.add(MonitorRoute);
	router.route(location.pathname);

	const markElem: HTMLElement | null = document.querySelector(
		'.common-logo_symbol',
	);
	if (markElem) {
		window.addEventListener('scroll', () => {
			const angle = window.scrollY * 0.5;
			markElem.style.transform = `rotate(${angle}deg)`;
		});
	}

	hljs.initHighlightingOnLoad();
})();
