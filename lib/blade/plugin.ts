import {createViewProps, ViewProps} from '../common/model/view-props';
import {findBooleanParam} from '../common/params';
import {forceCast} from '../misc/type-util';
import {BasePlugin} from '../plugin';
import {BladeApi} from './common/api/blade';
import {BladeParams} from './common/api/types';
import {Blade} from './common/model/blade';

interface Acceptance<P extends BladeParams> {
	params: Omit<P, 'disabled' | 'hidden'>;
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

	const disabled = findBooleanParam(args.params, 'disabled');
	const hidden = findBooleanParam(args.params, 'hidden');
	return plugin.api({
		blade: new Blade(),
		document: args.document,
		params: forceCast({
			...ac.params,
			disabled: disabled,
			hidden: hidden,
		}),
		viewProps: createViewProps({
			disabled: disabled,
			hidden: hidden,
		}),
	});
}
