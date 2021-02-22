import {Value} from '../../../common/model/value';
import {constrainRange, mapRange} from '../../../common/number-util';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';

interface Config {
	maxValue: number;
	minValue: number;
	value: Value<number>;
}

const className = ClassName('sld');

/**
 * @hidden
 */
export class SliderView implements ValueView<number> {
	public readonly element: HTMLElement;
	public readonly innerElement: HTMLDivElement;
	public readonly outerElement: HTMLDivElement;
	public readonly value: Value<number>;
	private maxValue_: number;
	private minValue_: number;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.minValue_ = config.minValue;
		this.maxValue_ = config.maxValue;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const outerElem = doc.createElement('div');
		outerElem.classList.add(className('o'));
		outerElem.tabIndex = 0;
		this.element.appendChild(outerElem);
		this.outerElement = outerElem;

		const innerElem = doc.createElement('div');
		innerElem.classList.add(className('i'));
		this.outerElement.appendChild(innerElem);
		this.innerElement = innerElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		const p = constrainRange(
			mapRange(this.value.rawValue, this.minValue_, this.maxValue_, 0, 100),
			0,
			100,
		);
		this.innerElement.style.width = `${p}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
