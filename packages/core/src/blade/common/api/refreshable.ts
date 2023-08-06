import {isObject} from '../../../misc/type-util.js';

export interface Refreshable {
	/**
	 * Refreshes the target.
	 */
	refresh(): void;
}

export function isRefreshable(value: unknown): value is Refreshable {
	if (!isObject(value)) {
		return false;
	}
	return 'refresh' in value && typeof value.refresh === 'function';
}
