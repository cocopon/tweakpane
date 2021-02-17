import {Formatter} from '../../formatter/formatter';
import {BufferedValue} from '../../model/buffered-value';
import {ViewModel} from '../../model/view-model';
import {MultiLogMonitorView} from '../../view/monitor/multi-log';
import {MonitorController} from './monitor';

interface Config<T> {
	formatter: Formatter<T>;
	lineCount: number;
	value: BufferedValue<T>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class MultiLogMonitorController<T> implements MonitorController<T> {
	public readonly viewModel: ViewModel;
	public readonly value: BufferedValue<T>;
	public readonly view: MultiLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new MultiLogMonitorView(document, {
			formatter: config.formatter,
			lineCount: config.lineCount,
			model: this.viewModel,
			value: this.value,
		});
	}
}
