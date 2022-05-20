import {forceCast, isEmpty} from '../../../misc/type-util';
import {Controller} from '../../controller/controller';
import {Parser} from '../../converter/parser';
import {Value} from '../../model/value';
import {createValue} from '../../model/values';
import {ViewProps} from '../../model/view-props';
import {getStepForKey, getVerticalStepKeys} from '../../ui';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvent,
} from '../../view/pointer-handler';
import {NumberTextProps, NumberTextView} from '../view/number-text';
import {SliderProps} from '../view/slider';

interface Config {
	baseStep: number;
	parser: Parser<number>;
	props: NumberTextProps;
	sliderProps?: SliderProps;
	value: Value<number>;
	viewProps: ViewProps;

	arrayPosition?: 'fst' | 'mid' | 'lst';
}

/**
 * @hidden
 */
export class NumberTextController implements Controller<NumberTextView> {
	public readonly props: NumberTextProps;
	public readonly value: Value<number>;
	public readonly view: NumberTextView;
	public readonly viewProps: ViewProps;
	private readonly sliderProps_: SliderProps | null;
	private readonly baseStep_: number;
	private readonly parser_: Parser<number>;
	private readonly dragging_: Value<number | null>;
	private originRawValue_ = 0;

	constructor(doc: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
		this.onInputKeyUp_ = this.onInputKeyUp_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.baseStep_ = config.baseStep;
		this.parser_ = config.parser;
		this.props = config.props;
		this.sliderProps_ = config.sliderProps ?? null;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.dragging_ = createValue<number | null>(null);
		this.view = new NumberTextView(doc, {
			arrayPosition: config.arrayPosition,
			dragging: this.dragging_,
			props: this.props,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
		this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
		this.view.inputElement.addEventListener('keyup', this.onInputKeyUp_);

		const ph = new PointerHandler(this.view.knobElement);
		ph.emitter.on('down', this.onPointerDown_);
		ph.emitter.on('move', this.onPointerMove_);
		ph.emitter.on('up', this.onPointerUp_);
	}

	private constrainValue_(value: number): number {
		const min = this.sliderProps_?.get('minValue');
		const max = this.sliderProps_?.get('maxValue');
		let v = value;
		if (min !== undefined) {
			v = Math.max(v, min);
		}
		if (max !== undefined) {
			v = Math.min(v, max);
		}
		return v;
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);
		const value = inputElem.value;

		const parsedValue = this.parser_(value);
		if (!isEmpty(parsedValue)) {
			this.value.rawValue = this.constrainValue_(parsedValue);
		}
		this.view.refresh();
	}

	private onInputKeyDown_(ev: KeyboardEvent): void {
		const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
		if (step === 0) {
			return;
		}
		this.value.setRawValue(this.constrainValue_(this.value.rawValue + step), {
			forceEmit: false,
			last: false,
		});
	}

	private onInputKeyUp_(ev: KeyboardEvent): void {
		const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
		if (step === 0) {
			return;
		}
		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}

	private onPointerDown_() {
		this.originRawValue_ = this.value.rawValue;
		this.dragging_.rawValue = 0;
	}

	private computeDraggingValue_(data: PointerData): number | null {
		if (!data.point) {
			return null;
		}

		const dx = data.point.x - data.bounds.width / 2;
		return this.constrainValue_(
			this.originRawValue_ + dx * this.props.get('draggingScale'),
		);
	}

	private onPointerMove_(ev: PointerHandlerEvent) {
		const v = this.computeDraggingValue_(ev.data);
		if (v === null) {
			return;
		}

		this.value.setRawValue(v, {
			forceEmit: false,
			last: false,
		});
		this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
	}

	private onPointerUp_(ev: PointerHandlerEvent) {
		const v = this.computeDraggingValue_(ev.data);
		if (v === null) {
			return;
		}

		this.value.setRawValue(v, {
			forceEmit: true,
			last: true,
		});
		this.dragging_.rawValue = null;
	}
}
