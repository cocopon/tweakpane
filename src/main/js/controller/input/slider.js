// @flow

import ConstraintUtil from '../../constraint/util';
import RangeConstraint from '../../constraint/range';
import PointerHandler from '../../misc/pointer-handler';
import NumberUtil from '../../misc/number-util';
import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import SliderInputView from '../../view/input/slider';

import type {PointerData} from '../../misc/pointer-handler';
import type {InputController} from './input';

type Config = {
	value: InputValue<number>,
};

function findRange(value: InputValue<number>): [?number, ?number] {
	const c = value.constraint
		? ConstraintUtil.findConstraint(value.constraint, RangeConstraint)
		: null;
	if (!c) {
		return [null, null];
	}

	return [c.minValue, c.maxValue];
}

function estimateSuitableRange(value: InputValue<number>): [number, number] {
	const [min, max] = findRange(value);
	return [FlowUtil.getOrDefault(min, 0), FlowUtil.getOrDefault(max, 100)];
}

export default class SliderInputController implements InputController<number> {
	+value: InputValue<number>;
	+view: SliderInputView;
	maxValue_: number;
	minValue_: number;
	ptHandler_: PointerHandler;

	constructor(document: Document, config: Config) {
		(this: any).onPointerDown_ = this.onPointerDown_.bind(this);
		(this: any).onPointerMove_ = this.onPointerMove_.bind(this);
		(this: any).onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;

		const [min, max] = estimateSuitableRange(this.value);
		this.minValue_ = min;
		this.maxValue_ = max;

		this.view = new SliderInputView(document, {
			maxValue: this.maxValue_,
			minValue: this.minValue_,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.outerElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);
	}

	onPointerDown_(d: PointerData): void {
		this.value.rawValue = NumberUtil.map(
			d.px,
			0,
			1,
			this.minValue_,
			this.maxValue_,
		);
		this.view.update();
	}

	onPointerMove_(d: PointerData): void {
		this.value.rawValue = NumberUtil.map(
			d.px,
			0,
			1,
			this.minValue_,
			this.maxValue_,
		);
		this.view.update();
	}

	onPointerUp_(d: PointerData): void {
		this.value.rawValue = NumberUtil.map(
			d.px,
			0,
			1,
			this.minValue_,
			this.maxValue_,
		);
		this.view.update();
	}
}
