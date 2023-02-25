import {
	BaseBladeParams,
	BladePlugin,
	parseRecord,
	VERSION,
} from '@tweakpane/core';

import {SeparatorApi} from './api/separator';
import {SeparatorController} from './controller/separator';

export interface SeparatorBladeParams extends BaseBladeParams {
	view: 'separator';
}

export const SeparatorBladePlugin: BladePlugin<SeparatorBladeParams> = {
	id: 'separator',
	type: 'blade',
	core: VERSION,
	accept(params) {
		const result = parseRecord<SeparatorBladeParams>(params, (p) => ({
			view: p.required.constant('separator'),
		}));
		return result ? {params: result} : null;
	},
	controller(args) {
		return new SeparatorController(args.document, {
			blade: args.blade,
			viewProps: args.viewProps,
		});
	},
	api(args) {
		if (!(args.controller instanceof SeparatorController)) {
			return null;
		}
		return new SeparatorApi(args.controller);
	},
};
