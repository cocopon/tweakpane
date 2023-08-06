import {Pane, TpPluginBundle} from 'tweakpane';

import {selectContainer} from '../util.js';

declare const TweakpaneCamerakitPlugin: TpPluginBundle;
declare const TweakpaneEssentialsPlugin: TpPluginBundle;

export function initPlugins() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		essentials: (container) => {
			const params = {
				interval: {min: 16, max: 48},
				radiogrid: 25,
			};
			const pane = new Pane({
				container: container,
			});
			pane.registerPlugin(TweakpaneEssentialsPlugin);

			// Bindings
			const fi = pane.addFolder({
				title: 'Bindings',
			});
			fi.addBinding(params, 'interval', {
				min: 0,
				max: 100,
				step: 1,
			});

			const scales = [10, 20, 25, 50, 75, 100];
			fi.addBinding(params, 'radiogrid', {
				groupName: 'scale',
				label: 'radiogrid',
				size: [3, 2],
				cells: (x: number, y: number) => ({
					title: `${scales[y * 3 + x]}%`,
					value: scales[y * 3 + x],
				}),
				view: 'radiogrid',
			});

			// Blades
			const fb = pane.addFolder({
				title: 'Blades',
			});
			const fpsGraph: any = fb.addBlade({
				label: 'fpsgraph',
				rows: 2,
				view: 'fpsgraph',
			});
			function render() {
				fpsGraph.begin();
				fpsGraph.end();
				requestAnimationFrame(render);
			}
			render();

			fb.addBlade({
				view: 'cubicbezier',
				value: [0.5, 0, 0.5, 1],

				expanded: true,
				label: 'cubic\nbezier',
				picker: 'inline',
			});

			fb.addBlade({
				view: 'buttongrid',
				size: [3, 3],
				cells: (x: number, y: number) => ({
					title: [
						['NW', 'N', 'NE'],
						['W', '*', 'E'],
						['SW', 'S', 'SE'],
					][y][x],
				}),
				label: 'button\ngrid',
			});
		},

		camerakit: (container) => {
			const params = {
				flen: 55,
				fnum: 1.8,
				iso: 100,
			};
			const pane = new Pane({
				container: container,
			});
			pane.registerPlugin(TweakpaneCamerakitPlugin);
			pane.addBinding(params, 'flen', {
				view: 'cameraring',
				series: 0,
			});
			pane.addBinding(params, 'fnum', {
				view: 'cameraring',
				series: 1,
				unit: {
					ticks: 10,
					pixels: 40,
					value: 0.2,
				},
				wide: true,
				min: 1.4,
				step: 0.02,
			});
			pane.addBinding(params, 'flen', {
				view: 'cameraring',
				series: 2,
			});
			pane.addBinding(params, 'iso', {
				view: 'camerawheel',
				amount: 10,
				min: 100,
				step: 100,
			});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
