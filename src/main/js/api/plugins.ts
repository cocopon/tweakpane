import {InputBindingPlugin} from '../plugin/input-binding';
import {MonitorBindingPlugin} from '../plugin/monitor-binding';

export const Plugins: {
	inputs: InputBindingPlugin<any, any>[];
	monitors: MonitorBindingPlugin<any, any>[];
} = {
	inputs: [],
	monitors: [],
};
