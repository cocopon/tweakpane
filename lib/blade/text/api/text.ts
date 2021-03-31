import {Formatter} from '../../../common/converter/formatter';
import {Emitter} from '../../../common/model/emitter';
import {TextController} from '../../../input-binding/common/controller/text';
import {BladeApi} from '../../common/api/blade';
import {TpChangeEvent} from '../../common/api/tp-event';
import {ApiChangeEvents} from '../../common/api/types';
import {LabeledController} from '../../labeled/controller';

export type TextApiEvents<T> = ApiChangeEvents<T>;

export class TextBladeApi<T> implements BladeApi {
	private readonly emitter_: Emitter<TextApiEvents<T>> = new Emitter();

	constructor(
		public readonly controller_: LabeledController<TextController<T>>,
	) {
		this.controller_.valueController.value.emitter.on('change', (ev) => {
			this.emitter_.emit('change', {
				event: new TpChangeEvent(this, ev.rawValue),
			});
		});
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

	get formatter(): Formatter<T> {
		return this.controller_.valueController.props.get('formatter');
	}

	set formatter(formatter: Formatter<T>) {
		this.controller_.valueController.props.set('formatter', formatter);
	}

	get value(): T {
		return this.controller_.valueController.value.rawValue;
	}

	set value(value: T) {
		this.controller_.valueController.value.rawValue = value;
	}

	public dispose(): void {
		this.controller_.blade.dispose();
	}

	public on<EventName extends keyof TextApiEvents<T>>(
		eventName: EventName,
		handler: (ev: TextApiEvents<T>[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}
}
