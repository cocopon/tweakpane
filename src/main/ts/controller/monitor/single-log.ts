import {Formatter} from '../../formatter/formatter';
import {Buffer, BufferedValue} from '../../model/buffered-value';
import {ViewModel} from '../../model/view-model';
import {SingleLogView} from '../../view/value/single-log';
import {ValueController} from '../input/value';

interface Config<T> {
	formatter: Formatter<T>;
	value: BufferedValue<T>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class SingleLogMonitorController<T>
	implements ValueController<Buffer<T>> {
	public readonly viewModel: ViewModel;
	public readonly value: BufferedValue<T>;
	public readonly view: SingleLogView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new SingleLogView(document, {
			formatter: config.formatter,
			model: this.viewModel,
			value: this.value,
		});
	}
}
