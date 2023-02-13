import {BufferedValueController} from '../../../blade/binding/controller/monitor-binding';
import {Formatter} from '../../../common/converter/formatter';
import {BufferedValue} from '../../../common/model/buffered-value';
import {ViewProps} from '../../../common/model/view-props';
import {MultiLogView} from '../view/multi-log';

interface Config<T> {
	formatter: Formatter<T>;
	rows: number;
	value: BufferedValue<T>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class MultiLogController<T>
	implements BufferedValueController<T, MultiLogView<T>>
{
	public readonly value: BufferedValue<T>;
	public readonly view: MultiLogView<T>;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config<T>) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new MultiLogView(doc, {
			formatter: config.formatter,
			rows: config.rows,
			value: this.value,
			viewProps: this.viewProps,
		});
	}
}
