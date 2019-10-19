import {Formatter} from '../../formatter/formatter';
import {MonitorValue} from '../../model/monitor-value';
import {SingleLogMonitorView} from '../../view/monitor/single-log';
import {MonitorController} from './monitor';

interface Config<T> {
	formatter: Formatter<T>;
	value: MonitorValue<T>;
}

/**
 * @hidden
 */
export class SingleLogMonitorController<T> implements MonitorController<T> {
	public readonly value: MonitorValue<T>;
	public readonly view: SingleLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.view = new SingleLogMonitorView(document, {
			formatter: config.formatter,
			value: this.value,
		});
	}

	public dispose(): void {
		this.view.dispose();
	}
}
