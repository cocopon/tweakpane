import {ListItem} from '../../../common/constraint/list';
import {Emitter} from '../../../common/model/emitter';
import {ListController} from '../../../input-binding/common/controller/list';
import {BladeApi, LabelableApi} from '../../common/api/blade';
import {TpChangeEvent} from '../../common/api/tp-event';
import {ApiChangeEvents} from '../../common/api/types';
import {LabeledController} from '../../labeled/controller';

export class ListBladeApi<T> implements BladeApi, LabelableApi {
	private readonly emitter_: Emitter<ApiChangeEvents<T>> = new Emitter();

	constructor(
		public readonly controller_: LabeledController<ListController<T>>,
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

	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	get options(): ListItem<T>[] {
		return this.controller_.valueController.props.get('options');
	}

	set options(options: ListItem<T>[]) {
		this.controller_.valueController.props.set('options', options);
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