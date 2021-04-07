import {TpError} from '../../../common/tp-error';
import {createApi} from '../../plugin';
import {BladeController} from '../controller/blade';
import {BladeApi} from './blade';
import {Plugins} from './plugins';

export function createBladeApi(
	document: Document,
	params: Record<string, unknown>,
): BladeApi<BladeController> {
	const api = Plugins.blades.reduce(
		(result: BladeApi<BladeController> | null, plugin) =>
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
