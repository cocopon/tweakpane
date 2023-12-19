import {Bindable} from '../../../common/binding/target.js';
import {Emitter} from '../../../common/model/emitter.js';
import {ValueEvents} from '../../../common/model/value.js';
import {BaseBladeParams} from '../../../common/params.js';
import {PluginPool} from '../../../plugin/pool.js';
import {BindingApi} from '../../binding/api/binding.js';
import {ButtonApi} from '../../button/api/button.js';
import {BladeApi} from '../../common/api/blade.js';
import {ContainerApi} from '../../common/api/container.js';
import {ContainerBladeApi} from '../../common/api/container-blade.js';
import {EventListenable} from '../../common/api/event-listenable.js';
import {
	BindingParams,
	ButtonParams,
	FolderParams,
	TabParams,
} from '../../common/api/params.js';
import {TpChangeEvent, TpFoldEvent} from '../../common/api/tp-event.js';
import {TabApi} from '../../tab/api/tab.js';
import {FolderController} from '../controller/folder.js';

export interface FolderApiEvents {
	change: TpChangeEvent<unknown, BladeApi>;
	fold: TpFoldEvent<FolderApi>;
}

export class FolderApi
	extends ContainerBladeApi<FolderController>
	implements ContainerApi, EventListenable<FolderApiEvents>
{
	private readonly emitter_: Emitter<FolderApiEvents>;

	/**
	 * @hidden
	 */
	constructor(controller: FolderController, pool: PluginPool) {
		super(controller, pool);

		this.emitter_ = new Emitter();

		this.controller.foldable
			.value('expanded')
			.emitter.on('change', (ev: ValueEvents<boolean>['change']) => {
				this.emitter_.emit('fold', new TpFoldEvent(this, ev.sender.rawValue));
			});

		this.rackApi_.on('change', (ev) => {
			this.emitter_.emit('change', ev);
		});
	}

	get expanded(): boolean {
		return this.controller.foldable.get('expanded');
	}

	set expanded(expanded: boolean) {
		this.controller.foldable.set('expanded', expanded);
	}

	get title(): string | undefined {
		return this.controller.props.get('title');
	}

	set title(title: string | undefined) {
		this.controller.props.set('title', title);
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
	 * @param handler The event handler.
	 * @return The API object itself.
	 */
	public on<EventName extends keyof FolderApiEvents>(
		eventName: EventName,
		handler: (ev: FolderApiEvents[EventName]) => void,
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

	/**
	 * Removes a global event listener.
	 * @param eventName The event name to listen.
	 * @param handler The event handler.
	 * @returns The API object itself.
	 */
	public off<EventName extends keyof FolderApiEvents>(
		eventName: EventName,
		handler: (ev: FolderApiEvents[EventName]) => void,
	): this {
		this.emitter_.off(eventName, handler);
		return this;
	}
}
