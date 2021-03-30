import {BladePlugin} from '../plugin/blade';
import {InputBindingPlugin} from '../plugin/input-binding';
import {MonitorBindingPlugin} from '../plugin/monitor-binding';
import {BasePlugin} from '../plugin/plugin';

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
