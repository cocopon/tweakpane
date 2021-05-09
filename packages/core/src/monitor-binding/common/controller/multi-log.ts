import {Controller} from '../../../common/controller/controller';
import {Formatter} from '../../../common/converter/formatter';
import {BufferedValue} from '../../../common/model/buffered-value';
import {ViewProps} from '../../../common/model/view-props';
import {MultiLogView} from '../view/multi-log';

interface Config<T> {
	formatter: Formatter<T>;
	lineCount: number;
	value: BufferedValue<T>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class MultiLogController<T> implements Controller<MultiLogView<T>> {
	public readonly value: BufferedValue<T>;
	public readonly view: MultiLogView<T>;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config<T>) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new MultiLogView(doc, {
			formatter: config.formatter,
			lineCount: config.lineCount,
			value: this.value,
			viewProps: this.viewProps,
		});
	}
}
