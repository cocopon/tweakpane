import {Emitter} from '../../../common/model/emitter';
import {ValueEvents} from '../../../common/model/value';
import {forceCast} from '../../../misc/type-util';
import {BladeApi} from '../../common/api/blade';
import {Refreshable} from '../../common/api/refreshable';
import {TpChangeEvent} from '../../common/api/tp-event';
import {BindingController} from '../controller/binding';

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
	implements Refreshable
{
	private readonly emitter_: Emitter<BindingApiEvents<Ex>>;

	/**
	 * @hidden
	 */
	constructor(controller: C) {
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

	/**
	 * The key of the bound value.
	 */
	get key(): string {
		return this.controller_.value.binding.target.key;
	}

	/**
	 * The generic tag with many uses.
	 */
	get tag(): string | undefined {
		return this.controller_.tag;
	}

	set tag(tag: string | undefined) {
		this.controller_.tag = tag;
	}

	public on<EventName extends keyof BindingApiEvents<Ex>>(
		eventName: EventName,
		handler: (ev: BindingApiEvents<Ex>[EventName]) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev);
		});
		return this;
	}

	public refresh(): void {
		this.controller_.value.fetch();
	}

	private onValueChange_(ev: ValueEvents<In>['change']) {
		const value = this.controller_.value;
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
