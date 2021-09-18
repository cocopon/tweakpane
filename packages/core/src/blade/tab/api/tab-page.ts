import {Bindable} from '../../../common/binding/target';
import {BaseBladeParams} from '../../../common/params';
import {View} from '../../../common/view/view';
import {ButtonApi} from '../../button/api/button';
import {BladeApi} from '../../common/api/blade';
import {BladeRackApi} from '../../common/api/blade-rack';
import {
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
	TabParams,
} from '../../common/api/params';
import {BladeController} from '../../common/controller/blade';
import {FolderApi} from '../../folder/api/folder';
import {InputBindingApi} from '../../input-binding/api/input-binding';
import {MonitorBindingApi} from '../../monitor-binding/api/monitor-binding';
import {RackApi} from '../../rack/api/rack';
import {SeparatorApi} from '../../separator/api/separator';
import {TabPageController} from '../controller/tab-page';
import {TabApi} from './tab';

export class TabPageApi implements BladeRackApi {
	public readonly controller_: TabPageController;
	private readonly rackApi_: RackApi;

	constructor(controller: TabPageController, contentRackApi: RackApi) {
		this.controller_ = controller;
		this.rackApi_ = contentRackApi;
	}

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

	get children(): BladeApi<BladeController<View>>[] {
		return this.rackApi_.children;
	}

	public addButton(params: ButtonParams): ButtonApi {
		return this.rackApi_.addButton(params);
	}

	public addFolder(params: FolderParams): FolderApi {
		return this.rackApi_.addFolder(params);
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		return this.rackApi_.addSeparator(opt_params);
	}

	public addTab(params: TabParams): TabApi {
		return this.rackApi_.addTab(params);
	}

	public add(api: BladeApi<BladeController<View>>, opt_index?: number): void {
		this.rackApi_.add(api, opt_index);
	}

	public remove(api: BladeApi<BladeController<View>>): void {
		this.rackApi_.remove(api);
	}

	public addInput<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]> {
		return this.rackApi_.addInput(object, key, opt_params);
	}

	public addMonitor<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: MonitorParams,
	): MonitorBindingApi<O[Key]> {
		return this.rackApi_.addMonitor(object, key, opt_params);
	}

	public addBlade(params: BaseBladeParams): BladeApi<BladeController<View>> {
		return this.rackApi_.addBlade(params);
	}
}
