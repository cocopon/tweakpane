import {TpBuffer} from '../../../common/model/buffered-value.js';
import {MonitorBindingController} from '../controller/monitor-binding.js';
import {BindingApi} from './binding.js';

/**
 * The API for the monitor binding between the parameter and the pane.
 * @template T
 */
export type MonitorBindingApi<T = unknown> = BindingApi<
	TpBuffer<T>,
	T,
	MonitorBindingController<T>
>;
