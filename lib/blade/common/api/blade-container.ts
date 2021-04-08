import {View} from '../../../common/view/view';
import {ButtonApi} from '../../button/api/button';
import {FolderApi} from '../../folder/api/folder';
import {SeparatorApi} from '../../separator/api/separator';
import {BladeController} from '../controller/blade';
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

export interface BladeContainerApi<C extends BladeController<View>>
	extends BladeApi<C> {
	/**
	 * Children of the container.
	 */
	readonly children: BladeApi<BladeController<View>>[];

	addButton(params: ButtonParams): ButtonApi;
	addFolder(params: FolderParams): FolderApi;
	addSeparator(opt_params?: SeparatorParams): SeparatorApi;
	add(api: BladeApi<BladeController<View>>): void;
	remove(api: BladeApi<BladeController<View>>): void;

	/**
	 * Creates a new input binding and add it to the container.
	 * @param object The binding target.
	 * @param key The key of the target property.
	 * @param opt_params The options of a binding.
	 * @return The API object.
	 */
	addInput<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]>;
	/**
	 * Creates a new monitor binding and add it to the container.
	 * @param object The binding target.
	 * @param key The key of the target property.
	 * @param opt_params The options of a binding.
	 * @return The API object.
	 */
	addMonitor<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]>;

	// TODO: Rename
	/**
	 * @hidden
	 */
	addBlade_v3_(opt_params?: BladeParams): BladeApi<BladeController<View>>;
}

export function addButtonAsBlade(
	api: BladeContainerApi<BladeController<View>>,
	params: ButtonParams,
): ButtonApi {
	return api.addBlade_v3_({
		...params,
		view: 'button',
	}) as ButtonApi;
}

export function addFolderAsBlade(
	api: BladeContainerApi<BladeController<View>>,
	params: FolderParams,
): FolderApi {
	return api.addBlade_v3_({
		...params,
		view: 'folder',
	}) as FolderApi;
}

export function addSeparatorAsBlade(
	api: BladeContainerApi<BladeController<View>>,
	opt_params?: SeparatorParams,
): SeparatorApi {
	const params = opt_params || {};
	return api.addBlade_v3_({
		...params,
		view: 'separator',
	});
}
