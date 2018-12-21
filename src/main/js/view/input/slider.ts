// @flow

import ClassName from '../../misc/class-name';
import NumberUtil from '../../misc/number-util';
import InputValue from '../../model/input-value';
import View from '../view';

import {InputView} from './input';

interface Config {
	maxValue: number;
	minValue: number;
	value: InputValue<number>;
}

const className = ClassName('sld', 'input');

export default class SliderInputView extends View implements InputView<number> {
	public readonly value: InputValue<number>;
	private innerElem_: HTMLDivElement;
	private maxValue_: number;
	private minValue_: number;
	private outerElem_: HTMLDivElement;

	constructor(document: Document, config: Config) {
		super(document);

		this.onValueChange_ = this.onValueChange_.bind(this);

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
		this.value = config.value;

		this.update();
	}

	get outerElement(): HTMLDivElement {
		return this.outerElem_;
	}

	get innerElement(): HTMLDivElement {
		return this.innerElem_;
	}

	public update(): void {
		const p = NumberUtil.map(
			this.value.rawValue,
			this.minValue_,
			this.maxValue_,
			0,
			100,
		);
		this.innerElem_.style.width = `${p}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
