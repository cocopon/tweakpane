import {ListBladeApi, Pane, TextBladeApi} from 'tweakpane';

import {selectContainer} from '../util';

function hoge(markerToFnMap: {
	[key: string]: (container: HTMLElement) => void;
}) {
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}

export function initBlades() {
	hoge({
		text(container) {
			const pane = new Pane({
				container: container,
			});
			pane.addBlade({
				view: 'text',

				label: 'name',
				parse: (v: unknown) => String(v),
				value: 'sketch-01',
			});
		},
		list(container) {
			const conPane = new Pane({
				container: selectContainer('list', true),
			});
			conPane.addBlade({
				view: 'text',
				label: 'value',
				parse: (v: unknown) => String(v),
				value: 'LDG',
			});

			const pane = new Pane({
				container: container,
			});
			const api = pane.addBlade({
				view: 'list',
				label: 'scene',
				options: [
					{text: 'loading', value: 'LDG'},
					{text: 'menu', value: 'MNU'},
					{text: 'field', value: 'FLD'},
				],
				value: 'LDG',
			}) as ListBladeApi<string>;
			api.on('change', (ev) => {
				(conPane.children[0] as TextBladeApi<string>).value = ev.value;
				conPane.refresh();
			});
		},
		slider(container) {
			const pane = new Pane({
				container: container,
			});
			pane.addBlade({
				view: 'slider',
				label: 'brightness',
				min: 0,
				max: 1,
				value: 0.5,
			});
		},
	});
}
