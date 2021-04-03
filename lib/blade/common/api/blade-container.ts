import {ButtonApi} from '../../button/api/button';
import {FolderApi} from '../../folder/api/folder';
import {SeparatorApi} from '../../separator/api/separator';
import {BladeApi} from './blade';
import {InputBindingApi} from './input-binding';
import {MonitorBindingApi} from './monitor-binding';
import {
	BladeParams,
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
} from './types';

/**
 * @hidden
 */
export interface BladeContainerApi extends BladeApi {
	addButton(params: ButtonParams): ButtonApi;
	addFolder(params: FolderParams): FolderApi;
	addSeparator(opt_params?: SeparatorParams): SeparatorApi;

	addInput<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]>;
	addMonitor<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]>;

	// TODO: Rename
	addBlade_v3_(opt_params?: BladeParams): BladeApi;
}

export function addButtonAsBlade(
	api: BladeContainerApi,
	params: ButtonParams,
): ButtonApi {
	return api.addBlade_v3_({
		...params,
		view: 'button',
	}) as ButtonApi;
}

export function addFolderAsBlade(
	api: BladeContainerApi,
	params: FolderParams,
): FolderApi {
	return api.addBlade_v3_({
		...params,
		view: 'folder',
	}) as FolderApi;
}

export function addSeparatorAsBlade(
	api: BladeContainerApi,
	opt_params?: SeparatorParams,
): SeparatorApi {
	const params = opt_params || {};
	return api.addBlade_v3_({
		...params,
		view: 'separator',
	});
}
