import {Formatter} from '../../formatter/formatter';
import {Disposable} from '../../model/disposable';
import {MonitorValue} from '../../model/monitor-value';
import {MultiLogMonitorView} from '../../view/monitor/multi-log';
import {ControllerConfig} from '../controller';
import {MonitorController} from './monitor';

interface Config<T> extends ControllerConfig {
	formatter: Formatter<T>;
	value: MonitorValue<T>;
}

/**
 * @hidden
 */
export class MultiLogMonitorController<T> implements MonitorController<T> {
	public readonly disposable: Disposable;
	public readonly value: MonitorValue<T>;
	public readonly view: MultiLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.disposable = config.disposable;
		this.view = new MultiLogMonitorView(document, {
			disposable: this.disposable,
			formatter: config.formatter,
			value: this.value,
		});
	}
}
