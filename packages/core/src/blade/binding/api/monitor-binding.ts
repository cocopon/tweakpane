import {TpBuffer} from '../../../common/model/buffered-value';
import {MonitorBindingController} from '../controller/monitor-binding';
import {BindingApi} from './binding';

/**
 * The API for the monitor binding between the parameter and the pane.
 * @template T
 */
export type MonitorBindingApi<T> = BindingApi<
	TpBuffer<T>,
	T,
	MonitorBindingController<T>
>;
