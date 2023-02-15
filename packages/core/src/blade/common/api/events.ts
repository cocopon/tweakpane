import {TpChangeEvent} from './tp-event';

export interface ApiChangeEvents<T> {
	change: TpChangeEvent<T>;
}
