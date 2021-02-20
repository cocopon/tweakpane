import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/formatter/formatter';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {ViewModel} from '../../../common/model/view-model';
import {MultiLogView} from '../view/multi-log';

interface Config<T> {
	formatter: Formatter<T>;
	lineCount: number;
	value: BufferedValue<T>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class MultiLogController<T> implements ValueController<Buffer<T>> {
	public readonly viewModel: ViewModel;
	public readonly value: BufferedValue<T>;
	public readonly view: MultiLogView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new MultiLogView(document, {
			formatter: config.formatter,
			lineCount: config.lineCount,
			model: this.viewModel,
			value: this.value,
		});
	}
}
