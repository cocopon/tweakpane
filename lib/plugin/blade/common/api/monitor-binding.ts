import {forceCast} from '../../../../misc/type-util';
import {MonitorBindingEvents} from '../../../common/binding/monitor';
import {Emitter} from '../../../common/model/emitter';
import {MonitorBindingController} from '../controller/monitor-binding';
import {BladeApi} from './blade';
import {TpUpdateEvent} from './tp-event';

export interface MonitorBindingApiEvents<T> {
	update: {
		event: TpUpdateEvent<T>;
	};
}

/**
 * The API for the monitor binding between the parameter and the pane.
 */
export class MonitorBindingApi<T> implements BladeApi {
	/**
	 * @hidden
	 */
	public readonly controller_: MonitorBindingController<T>;
	private readonly emitter_: Emitter<MonitorBindingApiEvents<T>>;

	/**
	 * @hidden
	 */
	constructor(bindingController: MonitorBindingController<T>) {
		this.onBindingUpdate_ = this.onBindingUpdate_.bind(this);

		this.emitter_ = new Emitter();

		this.controller_ = bindingController;
		this.controller_.binding.emitter.on('update', this.onBindingUpdate_);
	}

	get disabled(): boolean {
		return this.controller_.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller_.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller_.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller_.viewProps.set('hidden', hidden);
	}

	public dispose(): void {
		this.controller_.blade.dispose();
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
