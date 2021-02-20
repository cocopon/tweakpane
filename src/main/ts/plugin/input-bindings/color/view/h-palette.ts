import {NumberUtil} from '../../../../misc/number-util';
import * as ColorConverter from '../../../common/converter/color';
import {disposeElement} from '../../../common/disposing-util';
import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {PaneError} from '../../../common/pane-error';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';

const className = ClassName('hpl');

interface Config extends ViewConfig {
	value: Value<Color>;
}

/**
 * @hidden
 */
export class HPaletteView extends View implements ValueView<Color> {
	public readonly value: Value<Color>;
	private colorElem_: HTMLDivElement | null;
	private markerElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element.classList.add(className());
		this.element.tabIndex = 0;

		const colorElem = document.createElement('div');
		colorElem.classList.add(className('c'));
		this.element.appendChild(colorElem);
		this.colorElem_ = colorElem;

		const markerElem = document.createElement('div');
		markerElem.classList.add(className('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		this.update();

		config.model.emitter.on('dispose', () => {
			this.colorElem_ = disposeElement(this.colorElem_);
			this.markerElem_ = disposeElement(this.markerElem_);
		});
	}

	public update(): void {
		if (!this.markerElem_) {
			throw PaneError.alreadyDisposed();
		}

		const c = this.value.rawValue;
		const [h] = c.getComponents('hsv');
		this.markerElem_.style.backgroundColor = ColorConverter.toFunctionalRgbString(
			new Color([h, 100, 100], 'hsv'),
		);
		const left = NumberUtil.map(h, 0, 360, 0, 100);
		this.markerElem_.style.left = `${left}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
