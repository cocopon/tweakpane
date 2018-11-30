// @flow

import ConstraintUtil from '../../constraint/util';
import RangeConstraint from '../../constraint/range';
import * as DomUtil from '../../misc/dom-util';
import NumberUtil from '../../misc/number-util';
import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import SliderInputView from '../../view/input/slider';

import type {InputController} from './input';

type Config = {
	value: InputValue<number>,
};

function findRange(value: InputValue<number>): [?number, ?number] {
	const c = value.constraint ?
		ConstraintUtil.findConstraint(
			value.constraint,
			RangeConstraint,
		) :
		null;
	if (!c) {
		return [null, null];
	}

	return [
		c.minValue,
		c.maxValue,
	];
}

function estimateSuitableRange(value: InputValue<number>): [number, number] {
	const [min, max] = findRange(value);
	return [
		FlowUtil.getOrDefault(min, 0),
		FlowUtil.getOrDefault(max, 100),
	];
}

export default class SliderInputController implements InputController<number> {
	+value: InputValue<number>;
	+view: SliderInputView;
	maxValue_: number;
	minValue_: number;
	pressed_: boolean;

	constructor(document: Document, config: Config) {
		(this: any).onSliderMouseDown_ = this.onSliderMouseDown_.bind(this);
		(this: any).onSliderTouchMove_= this.onSliderTouchMove_.bind(this);
		(this: any).onSliderTouchStart_ = this.onSliderTouchStart_.bind(this);
		(this: any).onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
		(this: any).onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);

		this.pressed_ = false;

		this.value = config.value;

		const [min, max] = estimateSuitableRange(this.value);
		this.minValue_ = min;
		this.maxValue_ = max;

		this.view =  new SliderInputView(document, {
			maxValue: this.maxValue_,
			minValue: this.minValue_,
			value: this.value,
		});

		if (DomUtil.supportsTouch(document)) {
			this.view.outerElement.addEventListener(
				'touchstart',
				this.onSliderTouchStart_,
			);
			this.view.outerElement.addEventListener(
				'touchmove',
				this.onSliderTouchMove_,
			);
		} else {
			this.view.outerElement.addEventListener(
				'mousedown',
				this.onSliderMouseDown_,
			);
			document.addEventListener(
				'mousemove',
				this.onDocumentMouseMove_,
			);
			document.addEventListener(
				'mouseup',
				this.onDocumentMouseUp_,
			);
		}
	}

	computeRawValueFromX_(clientX: number): number {
		const w = this.view.outerElement.getBoundingClientRect().width;
		return NumberUtil.map(
			clientX,
			0, w,
			this.minValue_,
			this.maxValue_,
		);
	}

	onSliderMouseDown_(e: MouseEvent): void {
		// Prevent native text selection
		e.preventDefault();

		this.pressed_ = true;

		this.value.rawValue = this.computeRawValueFromX_(e.offsetX);
		this.view.update();
	}

	onDocumentMouseMove_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}

		const elemLeft = this.view.document.defaultView.scrollX + this.view.outerElement.getBoundingClientRect().left;
		const offsetX = e.pageX - elemLeft;
		this.value.rawValue = this.computeRawValueFromX_(offsetX);
		this.view.update();
	}

	onDocumentMouseUp_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}
		this.pressed_ = false;

		const elemLeft = this.view.document.defaultView.scrollX + this.view.outerElement.getBoundingClientRect().left;
		const offsetX = e.pageX - elemLeft;
		this.value.rawValue = this.computeRawValueFromX_(offsetX);
		this.view.update();
	}

	onSliderTouchStart_(e: TouchEvent) {
		// Prevent native page scroll
		e.preventDefault();

		const touch = e.targetTouches[0];
		const offsetX = touch.clientX - this.view.outerElement.getBoundingClientRect().left;
		this.value.rawValue = this.computeRawValueFromX_(offsetX);
		this.view.update();
	}

	onSliderTouchMove_(e: TouchEvent) {
		const touch = e.targetTouches[0];
		const offsetX = touch.clientX - this.view.outerElement.getBoundingClientRect().left;
		this.value.rawValue = this.computeRawValueFromX_(offsetX);
		this.view.update();
	}
}
