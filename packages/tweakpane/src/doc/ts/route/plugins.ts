import {TpPluginBundle} from '@tweakpane/core';
import {Pane} from 'tweakpane';

import {selectContainer} from '../util';

declare const TweakpaneCamerakitPlugin: TpPluginBundle;
declare const TweakpaneIntervalPlugin: TpPluginBundle;

export function initPlugins() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		interval: (container) => {
			const params = {
				log: '',
				size1: {min: 16, max: 48},
				size2: {min: 16, max: 48},
			};
			const consolePane = new Pane({
				container: selectContainer('interval', true),
			});
			consolePane.addMonitor(params, 'log', {
				interval: 0,
				label: 'value',
				lineCount: 4,
				multiline: true,
			});
			const pane = new Pane({
				container: container,
			});
			pane.registerPlugin(TweakpaneIntervalPlugin);
			pane.addInput(params, 'size1');
			pane.addInput(params, 'size2', {
				min: 0,
				max: 100,
				step: 1,
			});
			pane.on('change', (ev) => {
				params.log = JSON.stringify(ev.value, undefined, 2);
				consolePane.refresh();
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
			pane.addInput(params, 'flen', {
				view: 'cameraring',
				series: 0,
			} as any);
			pane.addInput(params, 'fnum', {
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
			} as any);
			pane.addInput(params, 'flen', {
				view: 'cameraring',
				series: 2,
			} as any);
			pane.addInput(params, 'iso', {
				view: 'camerawheel',
				amount: 10,
				min: 100,
				step: 100,
			} as any);
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
