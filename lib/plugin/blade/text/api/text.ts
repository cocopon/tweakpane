import {BladeApi} from '../../../../api/blade-api';
import {TpChangeEvent} from '../../../../api/tp-event';
import {ApiChangeEvents} from '../../../../api/types';
import {Formatter} from '../../../common/converter/formatter';
import {Emitter} from '../../../common/model/emitter';
import {TextController} from '../../../input-bindings/common/controller/text';
import {LabeledController} from '../../labeled/controller';

export type TextApiEvents<T> = ApiChangeEvents<T>;

export class TextBladeApi<T> implements BladeApi {
	private readonly emitter_: Emitter<TextApiEvents<T>> = new Emitter();

	constructor(
		public readonly controller: LabeledController<TextController<T>>,
	) {
		this.controller.valueController.value.emitter.on('change', (ev) => {
			this.emitter_.emit('change', {
				event: new TpChangeEvent(this, ev.rawValue),
			});
		});
	}

	get disabled(): boolean {
		return this.controller.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller.viewProps.set('disabled', disabled);
	}

	get hidden(): boolean {
		return this.controller.viewProps.get('hidden');
	}

	set hidden(hidden: boolean) {
		this.controller.viewProps.set('hidden', hidden);
	}

	get formatter(): Formatter<T> {
		return this.controller.valueController.props.get('formatter');
	}

	set formatter(formatter: Formatter<T>) {
		this.controller.valueController.props.set('formatter', formatter);
	}

	get value(): T {
		return this.controller.valueController.value.rawValue;
	}

	set value(value: T) {
		this.controller.valueController.value.rawValue = value;
	}

	public dispose(): void {
		this.controller.blade.dispose();
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
