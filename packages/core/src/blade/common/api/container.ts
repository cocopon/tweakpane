import {Bindable} from '../../../common/binding/target';
import {BaseBladeParams} from '../../../common/params';
import {BindingApi} from '../../binding/api/binding';
import {ButtonApi} from '../../button/api/button';
import {FolderApi} from '../../folder/api/folder';
import {SeparatorApi} from '../../separator/api/separator';
import {TabApi} from '../../tab/api/tab';
import {BladeApi} from './blade';
import {
	BindingParams,
	ButtonParams,
	FolderParams,
	SeparatorParams,
	TabParams,
} from './params';

export interface ContainerApi {
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
	 * Creates a new binding and add it to the container.
	 * @param object The binding target.
	 * @param key The key of the target property.
	 * @param opt_params The options of a binding.
	 * @return The API object.
	 */
	addBinding<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: BindingParams,
	): BindingApi<unknown, O[Key]>;

	/**
	 * Creates a new blade and add it to the container.
	 * @param params The options for a blade.
	 */
	addBlade(params: BaseBladeParams): BladeApi;
}

export function addButtonAsBlade(
	api: ContainerApi,
	params: ButtonParams,
): ButtonApi {
	return api.addBlade({
		...params,
		view: 'button',
	}) as ButtonApi;
}

export function addFolderAsBlade(
	api: ContainerApi,
	params: FolderParams,
): FolderApi {
	return api.addBlade({
		...params,
		view: 'folder',
	}) as FolderApi;
}

export function addSeparatorAsBlade(
	api: ContainerApi,
	opt_params?: SeparatorParams,
): SeparatorApi {
	const params = opt_params ?? {};
	return api.addBlade({
		...params,
		view: 'separator',
	});
}

export function addTabAsBlade(api: ContainerApi, params: TabParams): TabApi {
	return api.addBlade({
		...params,
		view: 'tab',
	}) as TabApi;
}
