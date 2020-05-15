import {Color} from '../../model/color';
import {Disposable} from '../../model/disposable';
import {MonitorValue} from '../../model/monitor-value';
import {ColorSwatchMonitorView} from '../../view/monitor/color-swatch';
import {ControllerConfig} from '../controller';
import {MonitorController} from './monitor';

interface Config extends ControllerConfig {
	value: MonitorValue<Color>;
}

/**
 * @hidden
 */
export class ColorSwatchMonitorController implements MonitorController<Color> {
	public readonly disposable: Disposable;
	public readonly value: MonitorValue<Color>;
	public readonly view: ColorSwatchMonitorView;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.disposable = config.disposable;
		this.view = new ColorSwatchMonitorView(document, {
			disposable: this.disposable,
			value: this.value,
		});
	}
}
