import {findStringParam} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {BladePlugin} from '../plugin';
import {SeparatorApi} from './api/separator';
import {SeparatorController} from './controller/separator';

export interface SeparatorBladeParams extends BladeParams {
	view: 'separator';
}

export const SeparatorBladePlugin: BladePlugin<SeparatorBladeParams> = {
	id: 'separator',
	accept(params) {
		if (findStringParam(params, 'view') !== 'separator') {
			return null;
		}

		return {
			params: {
				view: 'separator',
			},
		};
	},
	controller(args) {
		return new SeparatorController(args.document, {
			blade: args.blade,
			viewProps: args.viewProps,
		});
	},
	api(controller) {
		if (!(controller instanceof SeparatorController)) {
			return null;
		}
		return new SeparatorApi(controller);
	},
};
