import {createPane, Theme, toCss} from '../panepaint';
import * as Themes from '../themes';
import * as Util from '../util';

declare let hljs: any;
declare let Tweakpane: any;

function applyPreviewHtml(selector: string, theme: Theme, comment: string) {
	const elem = document.querySelector(selector);
	if (!elem) {
		return;
	}

	elem.textContent = [
		`<!-- ${comment} -->`,
		'<style>',
		toCss(':root', theme),
		'</style>',
	].join('\n');

	hljs.highlightBlock(elem);
}

function applyTheme({
	styleElem,
	theme,
}: {
	styleElem: HTMLStyleElement;
	theme: Theme;
}) {
	styleElem.textContent = toCss('*[data-preview-css]', theme);

	applyPreviewHtml(
		'*[data-preview-code]',
		theme,
		'Append this element into your head element to apply the theme',
	);
}

function createPreviewPane(containerElem: Element) {
	const PARAMS = {
		color: 'rgba(0, 0, 0, 0)',
		point2d: {x: 0, y: 0},
		slider: 0,
		text: 'text',
		monitor: [0, 1, 2, 3].map(() => Math.random().toFixed(2)).join('\n'),
	};
	const pane = new Tweakpane({
		container: containerElem,
		title: 'Preview',
	});
	pane.addInput(PARAMS, 'text');
	pane.addInput(PARAMS, 'slider', {
		max: 64,
		min: 0,
	});
	pane.addButton({
		title: 'button',
	});
	pane.addSeparator();
	pane.addMonitor(PARAMS, 'monitor', {
		interval: 0,
		multiline: true,
	});
	pane
		.addFolder({
			title: 'folder',
		})
		.addInput(PARAMS, 'color');
	pane
		.addFolder({
			title: 'folder',
		})
		.addInput(PARAMS, 'point2d');
	return pane;
}

export const ThemingRoute = {
	pathname: /^(\/tweakpane)?\/theming\.html$/,

	init: () => {
		const styleElem = document.createElement('style');
		document.head.appendChild(styleElem);

		const controllerElem = Util.selectContainer('controller');
		const previewElem = Util.selectContainer('preview');
		if (!controllerElem || !previewElem) {
			return;
		}

		const theme = Themes.create('translucent');
		applyPreviewHtml('*[data-exampleCss]', theme, 'Example theme: Translucent');

		const pane = createPane(controllerElem, theme);
		applyTheme({
			styleElem: styleElem,
			theme: theme,
		});
		pane.on('change', () => {
			applyTheme({
				styleElem: styleElem,
				theme: theme,
			});
		});

		createPreviewPane(previewElem);

		const markerToFnMap: {
			[key: string]: (container: HTMLElement | null) => void;
		} = {
			header: (container) => {
				if (container) {
					createPreviewPane(container);
				}
			},
		};
		Object.keys(markerToFnMap).forEach((marker) => {
			const initFn = markerToFnMap[marker];
			const container = Util.selectContainer(marker);
			initFn(container);
		});
	},
};
