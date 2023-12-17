import {Emitter} from '../../../common/model/emitter.js';
import {ValueEvents} from '../../../common/model/value.js';
import {forceCast} from '../../../misc/type-util.js';
import {BladeApi} from '../../common/api/blade.js';
import {EventListenable} from '../../common/api/event-listenable.js';
import {Refreshable} from '../../common/api/refreshable.js';
import {TpChangeEvent} from '../../common/api/tp-event.js';
import {BindingController} from '../controller/binding.js';

export interface BindingApiEvents<Ex> {
	change: TpChangeEvent<Ex, BindingApi<unknown, Ex>>;
}

/**
 * The API for binding between the parameter and the pane.
 * @template In The internal type.
 * @template Ex The external type.
 */
export class BindingApi<
		In = unknown,
		Ex = unknown,
		C extends BindingController<In> = BindingController<In>,
	>
	extends BladeApi<C>
	implements EventListenable<BindingApiEvents<Ex>>, Refreshable
{
	private readonly emitter_: Emitter<BindingApiEvents<Ex>>;

	/**
	 * @hidden
	 */
	constructor(controller: C) {
		super(controller);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.emitter_ = new Emitter();

		this.controller.value.emitter.on('change', this.onValueChange_);
	}

	get label(): string | null | undefined {
		return this.controller.labelController.props.get('label');
	}

	set label(label: string | null | undefined) {
		this.controller.labelController.props.set('label', label);
	}

	/**
	 * The key of the bound value.
	 */
	get key(): string {
		return this.controller.value.binding.target.key;
	}

	/**
	 * The generic tag with many uses.
	 */
	get tag(): string | undefined {
		return this.controller.tag;
	}

	set tag(tag: string | undefined) {
		this.controller.tag = tag;
	}

	public on<EventName extends keyof BindingApiEvents<Ex>>(
		eventName: EventName,
		handler: (ev: BindingApiEvents<Ex>[EventName]) => void,
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

	public off<EventName extends keyof BindingApiEvents<Ex>>(
		eventName: EventName,
		handler: (ev: BindingApiEvents<Ex>[EventName]) => void,
	): this {
		this.emitter_.off(eventName, handler);
		return this;
	}

	public refresh(): void {
		this.controller.value.fetch();
	}

	private onValueChange_(ev: ValueEvents<In>['change']) {
		const value = this.controller.value;
		this.emitter_.emit(
			'change',
			new TpChangeEvent(
				this as BindingApi,
				forceCast(value.binding.target.read()),
				ev.options.last,
			),
		);
	}
}
