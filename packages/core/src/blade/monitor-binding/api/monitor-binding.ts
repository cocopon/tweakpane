import {BufferedValueEvents} from '../../../common/model/buffered-value';
import {Emitter} from '../../../common/model/emitter';
import {forceCast} from '../../../misc/type-util';
import {BladeApi} from '../../common/api/blade';
import {TpChangeEvent} from '../../common/api/tp-event';
import {MonitorBindingController} from '../controller/monitor-binding';

export interface MonitorBindingApiEvents<T> {
	change: {
		event: TpChangeEvent<T>;
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

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.emitter_ = new Emitter();

		this.controller_.value.emitter.on('change', this.onValueChange_);
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
		this.controller_.value.fetch();
	}

	private onValueChange_(_ev: BufferedValueEvents<T>['change']) {
		const binding = this.controller_.value.binding;
		const value = binding.target.read();
		this.emitter_.emit('change', {
			event: new TpChangeEvent(
				this,
				forceCast(value),
				binding.target.presetKey,
			),
		});
	}
}
