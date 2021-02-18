import {InputBindingPlugin} from '../plugin/input-binding';
import {MonitorBindingPlugin} from '../plugin/monitor-binding';
import {BasePlugin} from '../plugin/plugin';

export const Plugins: {
	inputs: InputBindingPlugin<any, any>[];
	monitors: MonitorBindingPlugin<any, any>[];
} = {
	inputs: [],
	monitors: [],
};

export function getAllPlugins(): BasePlugin[] {
	return [...Plugins.inputs, ...Plugins.monitors];
}
