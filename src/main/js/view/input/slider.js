// @flow

import ClassName from '../../misc/class-name';
import NumberUtil from '../../misc/number-util';
import InputValue from '../../model/input-value';
import View from '../view';

import type {InputView} from './input';

type Config = {
	maxValue: number,
	minValue: number,
	value: InputValue<number>,
};

const className = ClassName('sld', 'input');

export default class SliderInputView extends View implements InputView<number> {
	maxValue_: number;
	minValue_: number;
	value_: InputValue<number>;

	innerElem_: HTMLDivElement;
	outerElem_: HTMLDivElement;

	constructor(document: Document, config: Config) {
		super(document);

		(this: any).onValueChange_ = this.onValueChange_.bind(this);

		this.minValue_ = config.minValue;
		this.maxValue_ = config.maxValue;

		this.element.classList.add(className());

		const outerElem = document.createElement('div');
		outerElem.classList.add(className('o'));
		this.element.appendChild(outerElem);
		this.outerElem_ = outerElem;

		const innerElem = document.createElement('div');
		innerElem.classList.add(className('i'));
		this.outerElem_.appendChild(innerElem);
		this.innerElem_ = innerElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value_ = config.value;

		this.update();
	}

	get value(): InputValue<number> {
		return this.value_;
	}

	get outerElement(): HTMLDivElement {
		return this.outerElem_;
	}

	get innerElement(): HTMLDivElement {
		return this.innerElem_;
	}

	update(): void {
		const p = NumberUtil.map(
			this.value_.rawValue,
			this.minValue_, this.maxValue_,
			0, 100,
		);
		this.innerElem_.style.width = `${p}%`;
	}

	onValueChange_(): void {
		this.update();
	}
}
