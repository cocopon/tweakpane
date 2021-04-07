import {TpError} from '../../../common/tp-error';
import {View} from '../../../common/view/view';
import {createApi} from '../../plugin';
import {BladeController} from '../controller/blade';
import {BladeApi} from './blade';
import {Plugins} from './plugins';

export function createBladeApi(
	document: Document,
	params: Record<string, unknown>,
): BladeApi<BladeController<View>> {
	const api = Plugins.blades.reduce(
		(result: BladeApi<BladeController<View>> | null, plugin) =>
			result ||
			createApi(plugin, {
				document: document,
				params: params,
			}),
		null,
	);
	if (!api) {
		throw new TpError({
			type: 'nomatchingview',
			context: {
				params: params,
			},
		});
	}
	return api;
}
