import * as ColorConverter from '../../converter/color';
import {ClassName} from '../../misc/class-name';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {MonitorValue} from '../../model/monitor-value';
import {View} from '../view';
import {MonitorView} from './monitor';

interface Config {
	value: MonitorValue<Color>;
}

const className = ClassName('csw', 'monitor');

/**
 * @hidden
 */
export class ColorSwatchMonitorView extends View implements MonitorView<Color> {
	public readonly value: MonitorValue<Color>;
	private swatchElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document);

		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.element.classList.add(className());

		const swatchElem = document.createElement('div');
		swatchElem.classList.add(className('sw'));
		this.element.appendChild(swatchElem);
		this.swatchElem_ = swatchElem;

		config.value.emitter.on('update', this.onValueUpdate_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		if (!this.swatchElem_) {
			throw PaneError.alreadyDisposed();
		}

		const values = this.value.rawValues;
		this.swatchElem_.style.backgroundColor =
			values.length > 0
				? ColorConverter.toHexRgbString(values[values.length - 1])
				: '';
	}

	private onValueUpdate_(): void {
		this.update();
	}
}
