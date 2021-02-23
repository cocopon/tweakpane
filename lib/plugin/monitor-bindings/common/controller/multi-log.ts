import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {MultiLogView} from '../view/multi-log';

interface Config<T> {
	formatter: Formatter<T>;
	lineCount: number;
	value: BufferedValue<T>;
}

/**
 * @hidden
 */
export class MultiLogController<T> implements ValueController<Buffer<T>> {
	public readonly value: BufferedValue<T>;
	public readonly view: MultiLogView<T>;

	constructor(doc: Document, config: Config<T>) {
		this.value = config.value;

		this.view = new MultiLogView(doc, {
			formatter: config.formatter,
			lineCount: config.lineCount,
			value: this.value,
		});
	}
}
