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
	maxValue_: number;
	minValue_: number;
	pressed_: boolean;
	value_: InputValue<number>;
	view_: SliderInputView;

	constructor(document: Document, config: Config) {
		(this: any).onSliderMouseDown_ = this.onSliderMouseDown_.bind(this);
		(this: any).onSliderTouchMove_= this.onSliderTouchMove_.bind(this);
		(this: any).onSliderTouchStart_ = this.onSliderTouchStart_.bind(this);
		(this: any).onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
		(this: any).onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);

		this.pressed_ = false;

		this.value_ = config.value;

		const [min, max] = estimateSuitableRange(this.value_);
		this.minValue_ = min;
		this.maxValue_ = max;

		this.view_ =  new SliderInputView(document, {
			maxValue: this.maxValue_,
			minValue: this.minValue_,
			value: this.value_,
		});

		if (DomUtil.supportsTouch(document)) {
			this.view_.outerElement.addEventListener(
				'touchstart',
				this.onSliderTouchStart_,
			);
			this.view_.outerElement.addEventListener(
				'touchmove',
				this.onSliderTouchMove_,
			);
		} else {
			this.view_.outerElement.addEventListener(
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

	get value(): InputValue<number> {
		return this.value_;
	}

	get view(): SliderInputView {
		return this.view_;
	}

	computeRawValueFromX_(clientX: number): number {
		const w = this.view_.outerElement.getBoundingClientRect().width;
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

		this.value_.rawValue = this.computeRawValueFromX_(e.offsetX);
		this.view_.update();
	}

	onDocumentMouseMove_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}

		const elemLeft = this.view_.document.defaultView.scrollX + this.view.outerElement.getBoundingClientRect().left;
		const offsetX = e.pageX - elemLeft;
		this.value_.rawValue = this.computeRawValueFromX_(offsetX);
		this.view_.update();
	}

	onDocumentMouseUp_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}
		this.pressed_ = false;

		const elemLeft = this.view_.document.defaultView.scrollX + this.view.outerElement.getBoundingClientRect().left;
		const offsetX = e.pageX - elemLeft;
		this.value_.rawValue = this.computeRawValueFromX_(offsetX);
		this.view_.update();
	}

	onSliderTouchStart_(e: TouchEvent) {
		// Prevent native page scroll
		e.preventDefault();

		const touch = e.targetTouches[0];
		const offsetX = touch.clientX - this.view.outerElement.getBoundingClientRect().left;
		this.value_.rawValue = this.computeRawValueFromX_(offsetX);
		this.view_.update();
	}

	onSliderTouchMove_(e: TouchEvent) {
		const touch = e.targetTouches[0];
		const offsetX = touch.clientX - this.view.outerElement.getBoundingClientRect().left;
		this.value_.rawValue = this.computeRawValueFromX_(offsetX);
		this.view_.update();
	}
}
