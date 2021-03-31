import {BladePlugin} from '../../../blade';
import {InputBindingPlugin} from '../../../input-binding';
import {MonitorBindingPlugin} from '../../../monitor-binding';
import {BasePlugin} from '../../../plugin';

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
