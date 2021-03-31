import {findStringParam} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {BladePlugin} from '../plugin';
import {SeparatorApi} from './api/separator';
import {SeparatorController} from './controller';

export interface SeparatorBladeParams extends BladeParams {
	view: 'separator';
}

function createParams(
	params: Record<string, unknown>,
): SeparatorBladeParams | null {
	if (findStringParam(params, 'view') !== 'separator') {
		return null;
	}

	return {
		view: 'separator',
	};
}

export const SeparatorBladePlugin: BladePlugin<SeparatorBladeParams> = {
	id: 'separator',
	accept(params) {
		const p = createParams(params);
		return p ? {params: p} : null;
	},
	api(args) {
		const c = new SeparatorController(args.document, {
			blade: args.blade,
			viewProps: args.viewProps,
		});
		return new SeparatorApi(c);
	},
};
