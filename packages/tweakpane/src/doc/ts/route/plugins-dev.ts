import {CounterPluginBundle} from 'ts/plugins/counter/bundle.js';
import {Pane, TpPluginBundle} from 'tweakpane';

import {selectContainer} from '../util.js';

declare const TweakpaneEssentialsPlugin: TpPluginBundle;

export function initPluginsDev() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		essentials(container) {
			const pane = new Pane({
				container: container,
			});
			pane.registerPlugin(TweakpaneEssentialsPlugin);

			const fpsGraph = pane.addBlade({
				view: 'fpsgraph',
				label: 'fps',
			}) as any;
			function render() {
				fpsGraph.begin();
				fpsGraph.end();
				requestAnimationFrame(render);
			}
			render();

			pane.addBinding({size: 's'}, 'size', {
				view: 'radiogrid',
				cells: (x: number, _y: number) => ({
					title: ['S', 'M', 'L'][x],
					value: ['s', 'm', 'l'][x],
				}),
				groupName: 'size',
				size: [3, 1],
				label: 'radio\ngrid',
			});

			pane.addBlade({
				view: 'cubicbezier',
				value: [0.5, 0, 0.5, 1],

				expanded: true,
				label: 'cubic\nbezier',
				picker: 'inline',
			});
		},
		counter(container) {
			const pane = new Pane({
				container: container,
			});
			pane.registerPlugin(CounterPluginBundle);
			pane.addBinding({count: 0}, 'count', {
				view: 'counter',
			});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
