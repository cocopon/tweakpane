import {RangeConstraint} from '../../constraint/range';
import {ConstraintUtil} from '../../constraint/util';
import {NumberUtil} from '../../misc/number-util';
import {PointerHandler, PointerHandlerEvents} from '../../misc/pointer-handler';
import {TypeUtil} from '../../misc/type-util';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {SliderInputView} from '../../view/input/slider';
import {ControllerConfig} from '../controller';
import {InputController} from './input';

interface Config extends ControllerConfig {
	value: InputValue<number>;
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
	public readonly disposable: Disposable;
	public readonly value: InputValue<number>;
	public readonly view: SliderInputView;
	private maxValue_: number;
	private minValue_: number;
	private ptHandler_: PointerHandler;

	constructor(document: Document, config: Config) {
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;

		const [min, max] = estimateSuitableRange(this.value);
		this.minValue_ = min;
		this.maxValue_ = max;

		this.disposable = config.disposable;
		this.view = new SliderInputView(document, {
			disposable: this.disposable,
			maxValue: this.maxValue_,
			minValue: this.minValue_,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.outerElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);
	}

	private onPointerDown_(ev: PointerHandlerEvents['down']): void {
		this.value.rawValue = NumberUtil.map(
			ev.data.px,
			0,
			1,
			this.minValue_,
			this.maxValue_,
		);
		this.view.update();
	}

	private onPointerMove_(ev: PointerHandlerEvents['move']): void {
		this.value.rawValue = NumberUtil.map(
			ev.data.px,
			0,
			1,
			this.minValue_,
			this.maxValue_,
		);
		this.view.update();
	}

	private onPointerUp_(ev: PointerHandlerEvents['up']): void {
		this.value.rawValue = NumberUtil.map(
			ev.data.px,
			0,
			1,
			this.minValue_,
			this.maxValue_,
		);
		this.view.update();
	}
}
