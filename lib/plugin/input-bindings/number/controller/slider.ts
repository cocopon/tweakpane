import {
	getHorizontalStepKeys,
	getStepForKey,
} from '../../../blade/common/controller/ui';
import {RangeConstraint} from '../../../common/constraint/range';
import {ConstraintUtil} from '../../../common/constraint/util';
import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {mapRange} from '../../../common/number-util';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvents,
} from '../../../common/view/pointer-handler';
import {SliderView} from '../view/slider';

interface Config {
	baseStep: number;
	value: Value<number>;
}

function findRange(
	value: Value<number>,
): [number | undefined, number | undefined] {
	const c = value.constraint
		? ConstraintUtil.findConstraint(value.constraint, RangeConstraint)
		: null;
	if (!c) {
		return [undefined, undefined];
	}

	return [c.minValue, c.maxValue];
}

function estimateSuitableRange(value: Value<number>): [number, number] {
	const [min, max] = findRange(value);
	return [min ?? 0, max ?? 100];
}

/**
 * @hidden
 */
export class SliderController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: SliderView;
	private maxValue_: number;
	private minValue_: number;
	private ptHandler_: PointerHandler;
	private baseStep_: number;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;
		this.baseStep_ = config.baseStep;

		const [min, max] = estimateSuitableRange(this.value);
		this.minValue_ = min;
		this.maxValue_ = max;

		this.view = new SliderView(doc, {
			maxValue: this.maxValue_,
			minValue: this.minValue_,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(doc, this.view.outerElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.outerElement.addEventListener('keydown', this.onKeyDown_);
	}

	private handlePointerEvent_(d: PointerData): void {
		this.value.rawValue = mapRange(d.px, 0, 1, this.minValue_, this.maxValue_);
	}

	private onPointerDown_(ev: PointerHandlerEvents['down']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerMove_(ev: PointerHandlerEvents['move']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerUp_(ev: PointerHandlerEvents['up']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		this.value.rawValue += getStepForKey(
			this.baseStep_,
			getHorizontalStepKeys(ev),
		);
	}
}
