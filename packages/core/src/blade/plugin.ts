import {ViewProps} from '../common/model/view-props';
import {BaseBladeParams} from '../common/params';
import {ParamsParsers} from '../common/params-parsers';
import {View} from '../common/view/view';
import {forceCast} from '../misc/type-util';
import {BasePlugin} from '../plugin/plugin';
import {PluginPool} from '../plugin/pool';
import {BladeApi} from './common/api/blade';
import {BladeController} from './common/controller/blade';
import {Blade, createBlade} from './common/model/blade';

interface Acceptance<P extends BaseBladeParams> {
	params: Omit<P, 'disabled' | 'hidden'>;
}

interface ControllerArguments<P extends BaseBladeParams> {
	blade: Blade;
	document: Document;
	params: P;
	viewProps: ViewProps;
}

interface ApiArguments {
	controller: BladeController<View>;
	pool: PluginPool;
}

export interface BladePlugin<P extends BaseBladeParams> extends BasePlugin {
	type: 'blade';
	accept: {
		(params: Record<string, unknown>): Acceptance<P> | null;
	};
	controller: {
		(args: ControllerArguments<P>): BladeController<View>;
	};
	api: {
		(args: ApiArguments): BladeApi<BladeController<View>> | null;
	};
}

export function createBladeController<P extends BaseBladeParams>(
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

	const disabled = ParamsParsers.optional.boolean(
		args.params['disabled'],
	).value;
	const hidden = ParamsParsers.optional.boolean(args.params['hidden']).value;
	return plugin.controller({
		blade: createBlade(),
		document: args.document,
		params: forceCast({
			...ac.params,
			disabled: disabled,
			hidden: hidden,
		}),
		viewProps: ViewProps.create({
			disabled: disabled,
			hidden: hidden,
		}),
	});
}
