import {Color} from '../../model/color';
import {MonitorValue} from '../../model/monitor-value';
import {ViewModel} from '../../model/view-model';
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
	public readonly viewModel: ViewModel;
	public readonly value: MonitorValue<Color>;
	public readonly view: ColorSwatchMonitorView;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new ColorSwatchMonitorView(document, {
			model: this.viewModel,
			value: this.value,
		});
	}
}
