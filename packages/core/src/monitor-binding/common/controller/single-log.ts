import {BufferedValueController} from '../../../blade/binding/controller/monitor-binding.js';
import {Formatter} from '../../../common/converter/formatter.js';
import {BufferedValue} from '../../../common/model/buffered-value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {SingleLogView} from '../view/single-log.js';

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
