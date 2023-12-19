import {Bindable, BindingTarget} from '../../../common/binding/target.js';
import {isBindingValue} from '../../../common/binding/value/binding.js';
import {Emitter} from '../../../common/model/emitter.js';
import {BaseBladeParams} from '../../../common/params.js';
import {TpError} from '../../../common/tp-error.js';
import {PluginPool} from '../../../plugin/pool.js';
import {BindingApi} from '../../binding/api/binding.js';
import {ButtonApi} from '../../button/api/button.js';
import {FolderApi} from '../../folder/api/folder.js';
import {TabApi} from '../../tab/api/tab.js';
import {RackController} from '../controller/rack.js';
import {RackEvents} from '../model/rack.js';
import {BladeApi} from './blade.js';
import {
	addButtonAsBlade,
	addFolderAsBlade,
	addTabAsBlade,
	ContainerApi,
} from './container.js';
import {EventListenable} from './event-listenable.js';
import {
	BindingParams,
	ButtonParams,
	FolderParams,
	TabParams,
} from './params.js';
import {isRefreshable} from './refreshable.js';
import {TpChangeEvent} from './tp-event.js';

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
export class RackApi implements ContainerApi, EventListenable<RackApiEvents> {
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
		const bc = api.controller;
		this.controller_.rack.add(bc, opt_index);
		return api;
	}

	public remove(api: BladeApi): void {
		this.controller_.rack.remove(api.controller);
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
		this.emitter_.on(
			eventName,
			(ev) => {
				bh(ev);
			},
			{
				key: handler,
			},
		);
		return this;
	}

	public off<EventName extends keyof RackApiEvents>(
		eventName: EventName,
		handler: (ev: RackApiEvents[EventName]) => void,
	): this {
		this.emitter_.off(eventName, handler);
		return this;
	}

	public refresh(): void {
		this.children.forEach((c) => {
			if (isRefreshable(c)) {
				c.refresh();
			}
		});
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
