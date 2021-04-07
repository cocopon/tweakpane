import {TextController} from '../../../common/controller/text';
import {Formatter} from '../../../common/converter/formatter';
import {Emitter} from '../../../common/model/emitter';
import {BladeApi, LabelableApi} from '../../common/api/blade';
import {TpChangeEvent} from '../../common/api/tp-event';
import {ApiChangeEvents} from '../../common/api/types';
import {LabeledController} from '../../labeled/controller/labeled';

export class TextBladeApi<T>
	extends BladeApi<LabeledController<TextController<T>>>
	implements LabelableApi {
	private readonly emitter_: Emitter<ApiChangeEvents<T>> = new Emitter();

	constructor(controller: LabeledController<TextController<T>>) {
		super(controller);

		this.controller_.valueController.value.emitter.on('change', (ev) => {
			this.emitter_.emit('change', {
				event: new TpChangeEvent(this, ev.rawValue),
			});
		});
	}

	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
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

	public on<EventName extends keyof ApiChangeEvents<T>>(
		eventName: EventName,
		handler: (ev: ApiChangeEvents<T>[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}
}
