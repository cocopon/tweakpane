import {forceCast, isEmpty} from '../../../misc/type-util';
import {ValueController} from '../../controller/value';
import {Parser} from '../../converter/parser';
import {BoundValue} from '../../model/bound-value';
import {Value} from '../../model/value';
import {ViewProps} from '../../model/view-props';
import {getStepForKey, getVerticalStepKeys} from '../../ui';
import {PointerHandler, PointerHandlerEvent} from '../../view/pointer-handler';
import {NumberTextProps, NumberTextView} from '../view/number-text';

interface Config {
	baseStep: number;
	parser: Parser<number>;
	props: NumberTextProps;
	value: Value<number>;
	viewProps: ViewProps;

	arrayPosition?: 'fst' | 'mid' | 'lst';
}

/**
 * @hidden
 */
export class NumberTextController implements ValueController<number> {
	public readonly props: NumberTextProps;
	public readonly value: Value<number>;
	public readonly view: NumberTextView;
	public readonly viewProps: ViewProps;
	private baseStep_: number;
	private parser_: Parser<number>;
	private originRawValue_ = 0;
	private dragging_: Value<number | null>;

	constructor(doc: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.baseStep_ = config.baseStep;
		this.parser_ = config.parser;
		this.props = config.props;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.dragging_ = new BoundValue<number | null>(null);
		this.view = new NumberTextView(doc, {
			arrayPosition: config.arrayPosition,
			dragging: this.dragging_,
			props: this.props,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
		this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);

		const ph = new PointerHandler(this.view.knobElement);
		ph.emitter.on('down', this.onPointerDown_);
		ph.emitter.on('move', this.onPointerMove_);
		ph.emitter.on('up', this.onPointerUp_);
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);
		const value = inputElem.value;

		const parsedValue = this.parser_(value);
		if (!isEmpty(parsedValue)) {
			this.value.rawValue = parsedValue;
		}
	}

	private onInputKeyDown_(e: KeyboardEvent): void {
		const step = getStepForKey(this.baseStep_, getVerticalStepKeys(e));
		if (step !== 0) {
			this.value.rawValue += step;
		}
	}

	private onPointerDown_() {
		this.originRawValue_ = this.value.rawValue;
		this.dragging_.rawValue = 0;
	}

	private onPointerMove_(ev: PointerHandlerEvent) {
		if (!ev.data.point) {
			return;
		}

		const dx = ev.data.point.x - ev.data.bounds.width / 2;
		this.value.rawValue =
			this.originRawValue_ + dx * this.props.get('draggingScale');
		this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
	}

	private onPointerUp_() {
		this.dragging_.rawValue = null;
	}
}
