// @flow

import * as ColorConverter from '../../converter/color';
import ClassName from '../../misc/class-name';
import Color from '../../model/color';
import MonitorValue from '../../model/monitor-value';
import View from '../view';

import type {MonitorView} from './monitor';

type Config = {
	value: MonitorValue<Color>,
};

const className = ClassName('csw', 'monitor');

export default class ColorSwatchMonitorView extends View
	implements MonitorView<Color> {
	+value: MonitorValue<Color>;
	swatchElem_: HTMLDivElement;

	constructor(document: Document, config: Config) {
		super(document);

		(this: any).onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.element.classList.add(className());

		const swatchElem = document.createElement('div');
		swatchElem.classList.add(className('sw'));
		this.element.appendChild(swatchElem);
		this.swatchElem_ = swatchElem;

		config.value.emitter.on('update', this.onValueUpdate_);
		this.value = config.value;

		this.update();
	}

	update(): void {
		const values = this.value.rawValues;

		this.swatchElem_.style.backgroundColor =
			values.length > 0
				? ColorConverter.toString(values[values.length - 1])
				: '';
	}

	onValueUpdate_(): void {
		this.update();
	}
}
