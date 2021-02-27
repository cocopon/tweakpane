import {forceCast} from '../misc/type-util';
import {MonitorBindingController} from '../plugin/blade/common/controller/monitor-binding';
import {MonitorBindingEvents} from '../plugin/common/binding/monitor';
import {TpUpdateEvent} from '../plugin/common/event/tp-event';
import {Emitter} from '../plugin/common/model/emitter';
import {ComponentApi} from './component-api';

export interface MonitorBindingApiEvents<T> {
	update: {
		event: TpUpdateEvent<T>;
	};
}

/**
 * The API for the monitor binding between the parameter and the pane.
 */
export class MonitorBindingApi<T> implements ComponentApi {
	/**
	 * @hidden
	 */
	public readonly controller: MonitorBindingController<T>;
	private readonly emitter_: Emitter<MonitorBindingApiEvents<T>>;

	/**
	 * @hidden
	 */
	constructor(bindingController: MonitorBindingController<T>) {
		this.onBindingUpdate_ = this.onBindingUpdate_.bind(this);

		this.emitter_ = new Emitter();

		this.controller = bindingController;
		this.controller.binding.emitter.on('update', this.onBindingUpdate_);
	}

	get hidden(): boolean {
		return this.controller.blade.hidden;
	}

	set hidden(hidden: boolean) {
		this.controller.blade.hidden = hidden;
	}

	public dispose(): void {
		this.controller.blade.dispose();
	}

	public on<EventName extends keyof MonitorBindingApiEvents<T>>(
		eventName: EventName,
		handler: (ev: MonitorBindingApiEvents<T>[EventName]['event']) => void,
	): MonitorBindingApi<T> {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}

	public refresh(): void {
		this.controller.binding.read();
	}

	private onBindingUpdate_(ev: MonitorBindingEvents<T>['update']) {
		const value = ev.sender.target.read();
		this.emitter_.emit('update', {
			event: new TpUpdateEvent(
				this,
				forceCast(value),
				this.controller.binding.target.presetKey,
			),
		});
	}
}
