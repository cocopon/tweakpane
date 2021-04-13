import {createViewProps, ViewProps} from '../common/model/view-props';
import {findBooleanParam} from '../common/params';
import {View} from '../common/view/view';
import {forceCast} from '../misc/type-util';
import {BasePlugin} from '../plugin';
import {BladeApi} from './common/api/blade';
import {BladeParams} from './common/api/types';
import {BladeController} from './common/controller/blade';
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
	controller: {
		(args: ApiArguments<P>): BladeController<View>;
	};
	api: {
		(controller: BladeController<View>): BladeApi<BladeController<View>> | null;
	};
}

export function createBladeController<P extends BladeParams>(
	plugin: BladePlugin<P>,
	args: {
		document: Document;
		params: Record<string, unknown>;
	},
): BladeController<View> | null {
	const ac = plugin.accept(args.params);
	if (!ac) {
		return null;
	}

	const disabled = findBooleanParam(args.params, 'disabled');
	const hidden = findBooleanParam(args.params, 'hidden');
	return plugin.controller({
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
