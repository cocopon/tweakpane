import {InputBindingPlugin} from '../../../input-bindings/plugin';
import {MonitorBindingPlugin} from '../../../monitor-bindings/plugin';
import {BasePlugin} from '../../../plugin';
import {BladePlugin} from '../../plugin';

export const Plugins: {
	blades: BladePlugin<any>[];
	inputs: InputBindingPlugin<any, any>[];
	monitors: MonitorBindingPlugin<any>[];
} = {
	blades: [],
	inputs: [],
	monitors: [],
};

export function getAllPlugins(): BasePlugin[] {
	return [...Plugins.blades, ...Plugins.inputs, ...Plugins.monitors];
}
