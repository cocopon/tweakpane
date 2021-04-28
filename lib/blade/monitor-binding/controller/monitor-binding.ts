import {MonitorBinding} from '../../../common/binding/monitor';
import {ValueController} from '../../../common/controller/value';
import {Buffer} from '../../../common/model/buffered-value';
import {Blade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelProps} from '../../label/view/label';

interface Config<T> {
	binding: MonitorBinding<T>;
	blade: Blade;
	props: LabelProps;
	valueController: ValueController<Buffer<T>>;
}

/**
 * @hidden
 */
export class MonitorBindingController<T> extends LabelController<
	ValueController<Buffer<T>>
> {
	public readonly binding: MonitorBinding<T>;

	constructor(doc: Document, config: Config<T>) {
		super(doc, config);

		this.binding = config.binding;

		this.viewProps.bindDisabled(this.binding.ticker);
		this.viewProps.handleDispose(() => {
			this.binding.dispose();
		});
	}
}
