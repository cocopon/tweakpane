import {Bindable} from '../../../common/binding/target';
import {BaseBladeParams} from '../../../common/params';
import {BindingApi} from '../../binding/api/binding';
import {ButtonApi} from '../../button/api/button';
import {BladeApi} from '../../common/api/blade';
import {ContainerApi} from '../../common/api/container';
import {ContainerBladeApi} from '../../common/api/container-blade';
import {
	BindingParams,
	ButtonParams,
	FolderParams,
	TabParams,
} from '../../common/api/params';
import {FolderApi} from '../../folder/api/folder';
import {TabPageController} from '../controller/tab-page';
import {TabApi} from './tab';

export class TabPageApi
	extends ContainerBladeApi<TabPageController>
	implements ContainerApi
{
	get title(): string {
		return this.controller_.itemController.props.get('title') ?? '';
	}

	set title(title: string) {
		this.controller_.itemController.props.set('title', title);
	}

	get selected(): boolean {
		return this.controller_.props.get('selected');
	}

	set selected(selected: boolean) {
		this.controller_.props.set('selected', selected);
	}

	get children(): BladeApi[] {
		return this.rackApi_.children;
	}

	public addButton(params: ButtonParams): ButtonApi {
		return this.rackApi_.addButton(params);
	}

	public addFolder(params: FolderParams): FolderApi {
		return this.rackApi_.addFolder(params);
	}

	public addTab(params: TabParams): TabApi {
		return this.rackApi_.addTab(params);
	}

	public add(api: BladeApi, opt_index?: number): void {
		this.rackApi_.add(api, opt_index);
	}

	public remove(api: BladeApi): void {
		this.rackApi_.remove(api);
	}

	public addBinding<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: BindingParams,
	): BindingApi<unknown, O[Key]> {
		return this.rackApi_.addBinding(object, key, opt_params);
	}

	public addBlade(params: BaseBladeParams): BladeApi {
		return this.rackApi_.addBlade(params);
	}
}
