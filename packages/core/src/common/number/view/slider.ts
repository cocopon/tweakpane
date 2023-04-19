import {Value} from '../../../common/model/value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';
import {constrainRange, mapRange} from '../util.js';

/**
 * @hidden
 */
export type SliderPropsObject = {
	keyScale: number;
	max: number;
	min: number;
};

/**
 * @hidden
 */
export type SliderProps = ValueMap<SliderPropsObject>;

/**
 * @hidden
 */
interface Config {
	props: SliderProps;
	value: Value<number>;
	viewProps: ViewProps;
}

const cn = ClassName('sld');

/**
 * @hidden
 */
export class SliderView implements View {
	public readonly element: HTMLElement;
	public readonly knobElement: HTMLDivElement;
	public readonly trackElement: HTMLDivElement;
	public readonly value: Value<number>;
	private readonly props_: SliderProps;

	constructor(doc: Document, config: Config) {
		this.onChange_ = this.onChange_.bind(this);

		this.props_ = config.props;
		this.props_.emitter.on('change', this.onChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const trackElem = doc.createElement('div');
		trackElem.classList.add(cn('t'));
		config.viewProps.bindTabIndex(trackElem);
		this.element.appendChild(trackElem);
		this.trackElement = trackElem;

		const knobElem = doc.createElement('div');
		knobElem.classList.add(cn('k'));
		this.trackElement.appendChild(knobElem);
		this.knobElement = knobElem;

		config.value.emitter.on('change', this.onChange_);
		this.value = config.value;

		this.update_();
	}

	private update_(): void {
		const p = constrainRange(
			mapRange(
				this.value.rawValue,
				this.props_.get('min'),
				this.props_.get('max'),
				0,
				100,
			),
			0,
			100,
		);
		this.knobElement.style.width = `${p}%`;
	}

	private onChange_(): void {
		this.update_();
	}
}
