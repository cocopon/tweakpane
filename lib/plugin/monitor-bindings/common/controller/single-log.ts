import {ValueController} from '../../../common/controller/value';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {Formatter} from '../../../common/writer/formatter';
import {SingleLogView} from '../view/single-log';

interface Config<T> {
	formatter: Formatter<T>;
	value: BufferedValue<T>;
}

/**
 * @hidden
 */
export class SingleLogMonitorController<T>
	implements ValueController<Buffer<T>> {
	public readonly value: BufferedValue<T>;
	public readonly view: SingleLogView<T>;

	constructor(doc: Document, config: Config<T>) {
		this.value = config.value;

		this.view = new SingleLogView(doc, {
			formatter: config.formatter,
			value: this.value,
		});
	}
}
