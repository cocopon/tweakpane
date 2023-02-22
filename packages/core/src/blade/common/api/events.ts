import {BladeApi} from './blade';
import {TpChangeEvent} from './tp-event';

export interface ApiChangeEvents<T> {
	change: TpChangeEvent<T, BladeApi>;
}
