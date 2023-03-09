import {BufferedValueController} from '../../../blade/binding/controller/monitor-binding';
import {Formatter} from '../../../common/converter/formatter';
import {BufferedValue} from '../../../common/model/buffered-value';
import {ViewProps} from '../../../common/model/view-props';
import {SingleLogView} from '../view/single-log';

interface Config<T> {
	formatter: Formatter<T>;
	value: BufferedValue<T>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SingleLogController<T>
	implements BufferedValueController<T, SingleLogView<T>>
{
	public readonly value: BufferedValue<T>;
	public readonly view: SingleLogView<T>;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config<T>) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new SingleLogView(doc, {
			formatter: config.formatter,
			value: this.value,
			viewProps: this.viewProps,
		});
	}
}