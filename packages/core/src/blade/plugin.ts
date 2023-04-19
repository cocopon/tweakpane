import {parseRecord} from '../common/micro-parsers.js';
import {ViewProps} from '../common/model/view-props.js';
import {BaseBladeParams} from '../common/params.js';
import {forceCast} from '../misc/type-util.js';
import {BasePlugin} from '../plugin/plugin.js';
import {PluginPool} from '../plugin/pool.js';
import {BladeApi} from './common/api/blade.js';
import {BladeController} from './common/controller/blade.js';
import {Blade, createBlade} from './common/model/blade.js';

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
	controller: BladeController;
	pool: PluginPool;
}

export interface BladePlugin<P extends BaseBladeParams> extends BasePlugin {
	type: 'blade';
	accept: {
		(params: Record<string, unknown>): Acceptance<P> | null;
	};
	controller: {
		(args: ControllerArguments<P>): BladeController;
	};
	api: {
		(args: ApiArguments): BladeApi | null;
	};
}

export function createBladeController<P extends BaseBladeParams>(
	plugin: BladePlugin<P>,
	args: {
		document: Document;
		params: Record<string, unknown>;
	},
): BladeController | null {
	const ac = plugin.accept(args.params);
	if (!ac) {
		return null;
	}

	const params = parseRecord(args.params, (p) => ({
		disabled: p.optional.boolean,
		hidden: p.optional.boolean,
	}));

	return plugin.controller({
		blade: createBlade(),
		document: args.document,
		params: forceCast({
			...ac.params,
			disabled: params?.disabled,
			hidden: params?.hidden,
		}),
		viewProps: ViewProps.create({
			disabled: params?.disabled,
			hidden: params?.hidden,
		}),
	});
}
