// @flow

import Color from '../../model/color';
import MonitorValue from '../../model/monitor-value';
import ColorSwatchMonitorView from '../../view/monitor/color-swatch';

import type {MonitorController} from './monitor';

type Config = {
	value: MonitorValue<Color>,
};

export default class ColorSwatchMonitorController
	implements MonitorController<Color> {
	+value: MonitorValue<Color>;
	+view: ColorSwatchMonitorView;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.view = new ColorSwatchMonitorView(document, {
			value: this.value,
		});
	}
}
