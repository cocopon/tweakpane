import Color from '../../model/color';
import MonitorValue from '../../model/monitor-value';
import ColorSwatchMonitorView from '../../view/monitor/color-swatch';

import {MonitorController} from './monitor';

interface Config {
	value: MonitorValue<Color>;
}

/**
 * @hidden
 */
export default class ColorSwatchMonitorController
	implements MonitorController<Color> {
	public readonly value: MonitorValue<Color>;
	public readonly view: ColorSwatchMonitorView;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.view = new ColorSwatchMonitorView(document, {
			value: this.value,
		});
	}

	public dispose(): void {
		this.view.dispose();
	}
}
