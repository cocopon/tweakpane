import {MonitorBindingEvents} from '../../../common/binding/monitor';
import {Emitter} from '../../../common/model/emitter';
import {forceCast} from '../../../misc/type-util';
import {BladeApi} from '../../common/api/blade';
import {TpUpdateEvent} from '../../common/api/tp-event';
import {MonitorBindingController} from '../controller/monitor-binding';

export interface MonitorBindingApiEvents<T> {
	update: {
		event: TpUpdateEvent<T>;
	};
}

/**
 * The API for the monitor binding between the parameter and the pane.
 */
export class MonitorBindingApi<T> extends BladeApi<
	MonitorBindingController<T>
> {
	private readonly emitter_: Emitter<MonitorBindingApiEvents<T>>;

	/**
	 * @hidden
	 */
	constructor(controller: MonitorBindingController<T>) {
		super(controller);

		this.onBindingUpdate_ = this.onBindingUpdate_.bind(this);

		this.emitter_ = new Emitter();

		this.controller_.binding.emitter.on('update', this.onBindingUpdate_);
	}

	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
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
		this.controller_.binding.read();
	}

	private onBindingUpdate_(ev: MonitorBindingEvents<T>['update']) {
		const value = ev.sender.target.read();
		this.emitter_.emit('update', {
			event: new TpUpdateEvent(
				this,
				forceCast(value),
				this.controller_.binding.target.presetKey,
			),
		});
	}
}
