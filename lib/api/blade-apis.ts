import {createApi} from '../plugin/blade';
import {TpError} from '../plugin/common/tp-error';
import {BladeApi} from './blade-api';
import {Plugins} from './plugins';

export function createBladeApi(
	document: Document,
	params: Record<string, unknown>,
): BladeApi {
	const api = Plugins.blades.reduce(
		(result: BladeApi | null, plugin) =>
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
