import {Bindable} from '../../../common/binding/target';
import {Emitter} from '../../../common/model/emitter';
import {ValueEvents} from '../../../common/model/value';
import {BaseBladeParams} from '../../../common/params';
import {View} from '../../../common/view/view';
import {PluginPool} from '../../../plugin/pool';
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
import {RackLikeApi} from '../../common/api/rack-like-api';
import {
	TpChangeEvent,
	TpFoldEvent,
	TpUpdateEvent,
} from '../../common/api/tp-event';
import {BladeController} from '../../common/controller/blade';
import {InputBindingApi} from '../../input-binding/api/input-binding';
import {MonitorBindingApi} from '../../monitor-binding/api/monitor-binding';
import {RackApi} from '../../rack/api/rack';
import {SeparatorApi} from '../../separator/api/separator';
import {TabApi} from '../../tab/api/tab';
import {FolderController} from '../controller/folder';

export interface FolderApiEvents {
	change: {
		event: TpChangeEvent<unknown>;
	};
	fold: {
		event: TpFoldEvent;
	};
	update: {
		event: TpUpdateEvent<unknown>;
	};
}

export class FolderApi
	extends RackLikeApi<FolderController>
	implements BladeRackApi
{
	private readonly emitter_: Emitter<FolderApiEvents>;

	/**
	 * @hidden
	 */
	constructor(controller: FolderController, pool: PluginPool) {
		super(controller, new RackApi(controller.rackController, pool));

		this.emitter_ = new Emitter();

		this.controller_.foldable
			.value('expanded')
			.emitter.on('change', (ev: ValueEvents<boolean>['change']) => {
				this.emitter_.emit('fold', {
					event: new TpFoldEvent(this, ev.sender.rawValue),
				});
			});

		this.rackApi_.on('change', (ev) => {
			this.emitter_.emit('change', {
				event: ev,
			});
		});
		this.rackApi_.on('update', (ev) => {
			this.emitter_.emit('update', {
				event: ev,
			});
		});
	}

	get expanded(): boolean {
		return this.controller_.foldable.get('expanded');
	}

	set expanded(expanded: boolean) {
		this.controller_.foldable.set('expanded', expanded);
	}

	get title(): string | undefined {
		return this.controller_.props.get('title');
	}

	set title(title: string | undefined) {
		this.controller_.props.set('title', title);
	}

	get children(): BladeApi<BladeController<View>>[] {
		return this.rackApi_.children;
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

	public addFolder(params: FolderParams): FolderApi {
		return this.rackApi_.addFolder(params);
	}

	public addButton(params: ButtonParams): ButtonApi {
		return this.rackApi_.addButton(params);
	}

	public addSeparator(opt_params?: SeparatorParams): SeparatorApi {
		return this.rackApi_.addSeparator(opt_params);
	}

	public addTab(params: TabParams): TabApi {
		return this.rackApi_.addTab(params);
	}

	public add<A extends BladeApi<BladeController<View>>>(
		api: A,
		opt_index?: number,
	): A {
		return this.rackApi_.add(api, opt_index);
	}

	public remove(api: BladeApi<BladeController<View>>): void {
		this.rackApi_.remove(api);
	}

	public addBlade(params: BaseBladeParams): BladeApi<BladeController<View>> {
		return this.rackApi_.addBlade(params);
	}

	/**
	 * Adds a global event listener. It handles all events of child inputs/monitors.
	 * @param eventName The event name to listen.
	 * @return The API object itself.
	 */
	public on<EventName extends keyof FolderApiEvents>(
		eventName: EventName,
		handler: (ev: FolderApiEvents[EventName]['event']) => void,
	): FolderApi {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}
}
