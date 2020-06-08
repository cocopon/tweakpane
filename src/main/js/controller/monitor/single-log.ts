import {Formatter} from '../../formatter/formatter';
import {MonitorValue} from '../../model/monitor-value';
import {ViewModel} from '../../model/view-model';
import {SingleLogMonitorView} from '../../view/monitor/single-log';
import {MonitorController} from './monitor';

interface Config<T> {
	formatter: Formatter<T>;
	value: MonitorValue<T>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class SingleLogMonitorController<T> implements MonitorController<T> {
	public readonly viewModel: ViewModel;
	public readonly value: MonitorValue<T>;
	public readonly view: SingleLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new SingleLogMonitorView(document, {
			formatter: config.formatter,
			model: this.viewModel,
			value: this.value,
		});
	}
}
