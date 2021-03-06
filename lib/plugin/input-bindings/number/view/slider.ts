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
	public readonly knobElement: HTMLDivElement;
	public readonly trackElement: HTMLDivElement;
	public readonly value: Value<number>;
	private readonly barElem_: HTMLElement;
	private maxValue_: number;
	private minValue_: number;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.minValue_ = config.minValue;
		this.maxValue_ = config.maxValue;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const trackElem = doc.createElement('div');
		trackElem.classList.add(className('t'));
		trackElem.tabIndex = 0;
		this.element.appendChild(trackElem);
		this.trackElement = trackElem;

		const barElem = doc.createElement('div');
		barElem.classList.add(className('b'));
		this.trackElement.appendChild(barElem);
		this.barElem_ = barElem;

		const knobElem = doc.createElement('div');
		knobElem.classList.add(className('k'));
		this.trackElement.appendChild(knobElem);
		this.knobElement = knobElem;

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
		this.barElem_.style.width = `${p}%`;
		this.knobElement.style.width = `${p}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
