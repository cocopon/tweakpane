import {Bindable} from '../../../common/binding/target';
import {Emitter} from '../../../common/model/emitter';
import {ValueEvents} from '../../../common/model/value';
import {BaseBladeParams} from '../../../common/params';
import {PluginPool} from '../../../plugin/pool';
import {BindingApi} from '../../binding/api/binding';
import {ButtonApi} from '../../button/api/button';
import {BladeApi} from '../../common/api/blade';
import {ContainerApi} from '../../common/api/container';
import {ContainerBladeApi} from '../../common/api/container-blade';
import {
	BindingParams,
	ButtonParams,
	FolderParams,
	SeparatorParams,
	TabParams,
} from '../../common/api/params';
import {TpChangeEvent, TpFoldEvent} from '../../common/api/tp-event';
import {SeparatorApi} from '../../separator/api/separator';
import {TabApi} from '../../tab/api/tab';
import {FolderController} from '../controller/folder';

export interface FolderApiEvents {
	change: TpChangeEvent<unknown, BladeApi>;
	fold: TpFoldEvent<FolderApi>;
}

export class FolderApi
	extends ContainerBladeApi<FolderController>
	implements ContainerApi
{
	private readonly emitter_: Emitter<FolderApiEvents>;

	/**
	 * @hidden
	 */
	constructor(controller: FolderController, pool: PluginPool) {
		super(controller, pool);

		this.emitter_ = new Emitter();

		this.controller_.foldable
			.value('expanded')
			.emitter.on('change', (ev: ValueEvents<boolean>['change']) => {
				this.emitter_.emit('fold', new TpFoldEvent(this, ev.sender.rawValue));
			});

		this.rackApi_.on('change', (ev) => {
			this.emitter_.emit('change', ev);
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

	get children(): BladeApi[] {
		return this.rackApi_.children;
	}

	public addBinding<O extends Bindable, Key extends keyof O>(
		object: O,
		key: Key,
		opt_params?: BindingParams,
	): BindingApi<unknown, O[Key]> {
		return this.rackApi_.addBinding(object, key, opt_params);
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

	public add<A extends BladeApi>(api: A, opt_index?: number): A {
		return this.rackApi_.add(api, opt_index);
	}

	public remove(api: BladeApi): void {
		this.rackApi_.remove(api);
	}

	public addBlade(params: BaseBladeParams): BladeApi {
		return this.rackApi_.addBlade(params);
	}

	/**
	 * Adds a global event listener. It handles all events of child inputs/monitors.
	 * @param eventName The event name to listen.
	 * @return The API object itself.
	 */
	public on<EventName extends keyof FolderApiEvents>(
		eventName: EventName,
		handler: (ev: FolderApiEvents[EventName]) => void,
	): FolderApi {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev);
		});
		return this;
	}
}
