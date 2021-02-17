import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {NumberUtil} from '../../misc/number-util';
import {PaneError} from '../../misc/pane-error';
import {Value} from '../../model/value';
import {View, ViewConfig} from '../view';
import {ValueView} from './value';

interface Config extends ViewConfig {
	maxValue: number;
	minValue: number;
	value: Value<number>;
}

const className = ClassName('sld');

/**
 * @hidden
 */
export class SliderView extends View implements ValueView<number> {
	public readonly value: Value<number>;
	private innerElem_: HTMLDivElement | null;
	private maxValue_: number;
	private minValue_: number;
	private outerElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.minValue_ = config.minValue;
		this.maxValue_ = config.maxValue;

		this.element.classList.add(className());

		const outerElem = document.createElement('div');
		outerElem.classList.add(className('o'));
		outerElem.tabIndex = 0;
		this.element.appendChild(outerElem);
		this.outerElem_ = outerElem;

		const innerElem = document.createElement('div');
		innerElem.classList.add(className('i'));
		this.outerElem_.appendChild(innerElem);
		this.innerElem_ = innerElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();

		config.model.emitter.on('dispose', () => {
			this.innerElem_ = DisposingUtil.disposeElement(this.innerElem_);
			this.outerElem_ = DisposingUtil.disposeElement(this.outerElem_);
		});
	}

	get outerElement(): HTMLDivElement {
		if (!this.outerElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.outerElem_;
	}

	get innerElement(): HTMLDivElement {
		if (!this.innerElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.innerElem_;
	}

	public update(): void {
		if (!this.innerElem_) {
			throw PaneError.alreadyDisposed();
		}

		const p = NumberUtil.constrain(
			NumberUtil.map(
				this.value.rawValue,
				this.minValue_,
				this.maxValue_,
				0,
				100,
			),
			0,
			100,
		);
		this.innerElem_.style.width = `${p}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
