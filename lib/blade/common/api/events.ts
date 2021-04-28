import {TpChangeEvent} from './tp-event';

/**
 * @hidden
 */
export interface ApiChangeEvents<T> {
	change: {
		event: TpChangeEvent<T>;
	};
}
