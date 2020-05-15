import {Formatter} from '../../formatter/formatter';
import {Disposable} from '../../model/disposable';
import {MonitorValue} from '../../model/monitor-value';
import {SingleLogMonitorView} from '../../view/monitor/single-log';
import {ControllerConfig} from '../controller';
import {MonitorController} from './monitor';

interface Config<T> extends ControllerConfig {
	formatter: Formatter<T>;
	value: MonitorValue<T>;
}

/**
 * @hidden
 */
export class SingleLogMonitorController<T> implements MonitorController<T> {
	public readonly disposable: Disposable;
	public readonly value: MonitorValue<T>;
	public readonly view: SingleLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.disposable = config.disposable;
		this.view = new SingleLogMonitorView(document, {
			disposable: this.disposable,
			formatter: config.formatter,
			value: this.value,
		});
	}
}
