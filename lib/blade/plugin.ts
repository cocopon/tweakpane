import {createViewProps, ViewProps} from '../common/model/view-props';
import {BasePlugin} from '../plugin';
import {BladeApi} from './common/api/blade';
import {BladeParams} from './common/api/types';
import {Blade} from './common/model/blade';

interface Acceptance<P extends BladeParams> {
	params: P;
}

interface ApiArguments<P extends BladeParams> {
	blade: Blade;
	document: Document;
	params: P;
	viewProps: ViewProps;
}

export interface BladePlugin<P extends BladeParams> extends BasePlugin {
	accept: {
		(params: Record<string, unknown>): Acceptance<P> | null;
	};
	api: {
		(args: ApiArguments<P>): BladeApi;
	};
}

export function createApi<P extends BladeParams>(
	plugin: BladePlugin<P>,
	args: {
		document: Document;
		params: Record<string, unknown>;
	},
): BladeApi | null {
	const ac = plugin.accept(args.params);
	if (!ac) {
		return null;
	}

	return plugin.api({
		blade: new Blade(),
		document: args.document,
		params: ac.params,
		viewProps: createViewProps({
			disabled: ac.params.disabled,
		}),
	});
}
