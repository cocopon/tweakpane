import {RangeConstraint} from '../../constraint/range';
import {ConstraintUtil} from '../../constraint/util';
import {NumberUtil} from '../../misc/number-util';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvents,
} from '../../misc/pointer-handler';
import {TypeUtil} from '../../misc/type-util';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {SliderInputView} from '../../view/input/slider';
import * as UiUtil from '../ui-util';
import {InputController} from './input';

interface Config {
	value: InputValue<number>;
	viewModel: ViewModel;
}

function findRange(
	value: InputValue<number>,
): [number | undefined, number | undefined] {
	const c = value.constraint
		? ConstraintUtil.findConstraint(value.constraint, RangeConstraint)
		: null;
	if (!c) {
		return [undefined, undefined];
	}

	return [c.minValue, c.maxValue];
}

function estimateSuitableRange(value: InputValue<number>): [number, number] {
	const [min, max] = findRange(value);
	return [
		TypeUtil.getOrDefault<number>(min, 0),
		TypeUtil.getOrDefault<number>(max, 100),
	];
}

/**
 * @hidden
 */
export class SliderInputController implements InputController<number> {
	public readonly viewModel: ViewModel;
	public readonly value: InputValue<number>;
	public readonly view: SliderInputView;
	private maxValue_: number;
	private minValue_: number;
	private ptHandler_: PointerHandler;
	private step_: number;

	constructor(document: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;
		this.step_ = UiUtil.getStepForTextInput(this.value.constraint);

		const [min, max] = estimateSuitableRange(this.value);
		this.minValue_ = min;
		this.maxValue_ = max;

		this.viewModel = config.viewModel;
		this.view = new SliderInputView(document, {
			maxValue: this.maxValue_,
			minValue: this.minValue_,
			model: this.viewModel,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.outerElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.outerElement.addEventListener('keydown', this.onKeyDown_);
	}

	private handlePointerEvent_(d: PointerData): void {
		this.value.rawValue = NumberUtil.map(
			d.px,
			0,
			1,
			this.minValue_,
			this.maxValue_,
		);
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
		this.value.rawValue += UiUtil.getStepForKey(
			this.step_,
			UiUtil.getHorizontalStepKeys(ev),
		);
	}
}
