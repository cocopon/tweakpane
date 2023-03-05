import {Bindable, BindingTarget} from '../../../common/binding/target';
import {isBindingValue} from '../../../common/binding/value/binding';
import {Emitter} from '../../../common/model/emitter';
import {BaseBladeParams} from '../../../common/params';
import {TpError} from '../../../common/tp-error';
import {PluginPool} from '../../../plugin/pool';
import {BindingApi} from '../../binding/api/binding';
import {ButtonApi} from '../../button/api/button';
import {FolderApi} from '../../folder/api/folder';
import {TabApi} from '../../tab/api/tab';
import {RackController} from '../controller/rack';
import {RackEvents} from '../model/rack';
import {BladeApi} from './blade';
import {
	addButtonAsBlade,
	addFolderAsBlade,
	addTabAsBlade,
	ContainerApi,
} from './container';
import {BindingParams, ButtonParams, FolderParams, TabParams} from './params';
import {TpChangeEvent} from './tp-event';

/**
 * @hidden
 */
interface RackApiEvents {
	change: TpChangeEvent<unknown, BladeApi>;
}

function createBindingTarget<O extends Bindable, Key extends keyof O>(
	obj: O,
	key: Key,
): BindingTarget {
	if (!BindingTarget.isBindable(obj)) {
		throw TpError.notBindable();
	}
	return new BindingTarget(obj, key as string);
}

/**
 * @hidden
 */
export class RackApi implements ContainerApi {
	private readonly controller_: RackController;
	private readonly emitter_: Emitter<RackApiEvents>;
	private readonly pool_: PluginPool;

	constructor(controller: RackController, pool: PluginPool) {
		this.onRackValueChange_ = this.onRackValueChange_.bind(this);

		this.controller_ = controller;
		this.emitter_ = new Emitter();
		this.pool_ = pool;

		const rack = this.controller_.rack;
		rack.emitter.on('valuechange', this.onRackValueChange_);
	}

	get children(): BladeApi[] {
		return this.controller_.rack.children.map((bc) => this.pool_.createApi(bc));
	}

	public addBinding<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: BindingParams,
	): BindingApi<unknown, O[Key]> {
		const params = opt_params ?? {};
		const doc = this.controller_.element.ownerDocument;
		const bc = this.pool_.createBinding(
			doc,
			createBindingTarget(object, key),
			params,
		);
		const api = this.pool_.createBindingApi(bc);
		return this.add(api, params.index);
	}

	public addFolder(params: FolderParams): FolderApi {
		return addFolderAsBlade(this, params);
	}

	public addButton(params: ButtonParams): ButtonApi {
		return addButtonAsBlade(this, params);
	}

	public addTab(params: TabParams): TabApi {
		return addTabAsBlade(this, params);
	}

	public add<A extends BladeApi>(api: A, opt_index?: number): A {
		const bc = api['controller_'];
		this.controller_.rack.add(bc, opt_index);
		return api;
	}

	public remove(api: BladeApi): void {
		this.controller_.rack.remove(api['controller_']);
	}

	public addBlade(params: BaseBladeParams): BladeApi {
		const doc = this.controller_.element.ownerDocument;
		const bc = this.pool_.createBlade(doc, params);
		const api = this.pool_.createApi(bc);
		return this.add(api, params.index);
	}

	public on<EventName extends keyof RackApiEvents>(
		eventName: EventName,
		handler: (ev: RackApiEvents[EventName]) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev);
		});
		return this;
	}

	private onRackValueChange_(ev: RackEvents['valuechange']): void {
		const bc = ev.bladeController;
		const api = this.pool_.createApi(bc);
		const binding = isBindingValue(bc.value) ? bc.value.binding : null;

		this.emitter_.emit(
			'change',
			new TpChangeEvent(
				api,
				binding ? binding.target.read() : bc.value.rawValue,
				ev.options.last,
			),
		);
	}
}
