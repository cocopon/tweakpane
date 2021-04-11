import {Emitter} from '../../../common/model/emitter';
import {View} from '../../../common/view/view';
import {BladeRackApi} from '../../blade-rack/api/blade-rack';
import {ButtonApi} from '../../button/api/button';
import {BladeApi} from '../../common/api/blade';
import {BladeContainerApi} from '../../common/api/blade-container';
import {
	TpChangeEvent,
	TpFoldEvent,
	TpUpdateEvent,
} from '../../common/api/tp-event';
import {
	BladeParams,
	ButtonParams,
	FolderParams,
	InputParams,
	MonitorParams,
	SeparatorParams,
} from '../../common/api/types';
import {BladeController} from '../../common/controller/blade';
import {InputBindingApi} from '../../input-binding/api/input-binding';
import {MonitorBindingApi} from '../../monitor-binding/api/monitor-binding';
import {SeparatorApi} from '../../separator/api/separator';
import {FolderController} from '../controller/folder';
import {FolderEvents} from '../model/folder';

interface FolderApiEvents {
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

export class FolderApi extends BladeApi<FolderController>
	implements BladeContainerApi {
	private readonly emitter_: Emitter<FolderApiEvents>;
	private readonly rackApi_: BladeRackApi;

	/**
	 * @hidden
	 */
	constructor(controller: FolderController) {
		super(controller);

		this.onFolderChange_ = this.onFolderChange_.bind(this);

		this.emitter_ = new Emitter();

		this.controller_.folder.emitter.on('change', this.onFolderChange_);

		this.rackApi_ = new BladeRackApi(controller.rackController);
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
		return this.controller_.folder.expanded;
	}

	set expanded(expanded: boolean) {
		this.controller_.folder.expanded = expanded;
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

	public addInput<O extends Record<string, any>, Key extends string>(
		object: O,
		key: Key,
		opt_params?: InputParams,
	): InputBindingApi<unknown, O[Key]> {
		return this.rackApi_.addInput(object, key, opt_params);
	}

	public addMonitor<O extends Record<string, any>, Key extends string>(
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

	public add<A extends BladeApi<BladeController<View>>>(
		api: A,
		opt_index?: number,
	): A {
		return this.rackApi_.add(api, opt_index);
	}

	public remove(api: BladeApi<BladeController<View>>): void {
		this.rackApi_.remove(api);
	}

	public addBlade_v3_(
		opt_params?: BladeParams,
	): BladeApi<BladeController<View>> {
		return this.rackApi_.addBlade_v3_(opt_params);
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

	private onFolderChange_(ev: FolderEvents['change']) {
		if (ev.propertyName !== 'expanded') {
			return;
		}

		this.emitter_.emit('fold', {
			event: new TpFoldEvent(this, ev.sender.expanded),
		});
	}
}
