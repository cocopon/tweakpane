import {TpBuffer} from '../../../common/model/buffered-value';
import {TpChangeEvent} from '../../common/api/tp-event';
import {MonitorBindingController} from '../controller/monitor-binding';
import {BindingApi} from './binding';

export interface MonitorBindingApiEvents<T> {
	change: {
		event: TpChangeEvent<T>;
	};
}

/**
 * The API for the monitor binding between the parameter and the pane.
 * @template T
 */
export type MonitorBindingApi<T> = BindingApi<
	TpBuffer<T>,
	T,
	MonitorBindingController<T>
>;
