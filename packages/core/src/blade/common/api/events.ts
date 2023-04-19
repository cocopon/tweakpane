import {BladeApi} from './blade.js';
import {TpChangeEvent} from './tp-event.js';

export interface ApiChangeEvents<T> {
	change: TpChangeEvent<T, BladeApi>;
}
