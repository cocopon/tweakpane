import {Bindable} from '../../../common/binding/target';
import {BaseBladeParams} from '../../../common/params';
import {InputBindingApi} from '../../binding/api/input-binding';
import {MonitorBindingApi} from '../../binding/api/monitor-binding';
import {ButtonApi} from '../../button/api/button';
import {FolderApi} from '../../folder/api/folder';
import {SeparatorApi} from '../../separator/api/separator';
import {TabApi} from '../../tab/api/tab';
import {BladeApi} from './blade';
import {
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
	TabParams,
} from './params';

export interface BladeRackApi {
	/**
	 * Children of the container.
	 */
	readonly children: BladeApi[];

	addButton(params: ButtonParams): ButtonApi;
	addFolder(params: FolderParams): FolderApi;
	addSeparator(opt_params?: SeparatorParams): SeparatorApi;
	addTab(params: TabParams): TabApi;
	add(api: BladeApi, opt_index?: number): void;
	remove(api: BladeApi): void;

	/**
	 * Creates a new input binding and add it to the container.
	 * @param object The binding target.
	 * @param key The key of the target property.
	 * @param opt_params The options of a binding.
	 * @return The API object.
	 */
	addInput<O extends Bindable, Key extends keyof O>(
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
	addMonitor<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]>;

	/**
	 * Creates a new blade and add it to the container.
	 * @param params The options for a blade.
	 */
	addBlade(params: BaseBladeParams): BladeApi;
}

export function addButtonAsBlade(
	api: BladeRackApi,
	params: ButtonParams,
): ButtonApi {
	return api.addBlade({
		...params,
		view: 'button',
	}) as ButtonApi;
}

export function addFolderAsBlade(
	api: BladeRackApi,
	params: FolderParams,
): FolderApi {
	return api.addBlade({
		...params,
		view: 'folder',
	}) as FolderApi;
}

export function addSeparatorAsBlade(
	api: BladeRackApi,
	opt_params?: SeparatorParams,
): SeparatorApi {
	const params = opt_params ?? {};
	return api.addBlade({
		...params,
		view: 'separator',
	});
}

export function addTabAsBlade(api: BladeRackApi, params: TabParams): TabApi {
	return api.addBlade({
		...params,
		view: 'tab',
	}) as TabApi;
}
