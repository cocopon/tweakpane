// @flow

import MonitorValue from '../../model/monitor-value';
import ColorSwatchMonitorView from '../../view/monitor/color-swatch';

import type {Color} from '../../model/color';
import type {MonitorController} from './monitor';

type Config = {
	value: MonitorValue<Color>,
};

export default class ColorSwatchMonitorController implements MonitorController<Color> {
	value_: MonitorValue<Color>;
	view_: ColorSwatchMonitorView;

	constructor(document: Document, config: Config) {
		this.value_ = config.value;

		this.view_ = new ColorSwatchMonitorView(document, {
			value: this.value_,
		});
	}

	get value(): MonitorValue<Color> {
		return this.value_;
	}

	get view(): ColorSwatchMonitorView {
		return this.view_;
	}
}
