import {MonitorBinding} from '../../../common/binding/monitor';
import {ValueController} from '../../../common/controller/value';
import {Buffer} from '../../../common/model/buffered-value';
import {bindDisabled} from '../../../common/view/reactive';
import {LabeledController} from '../../labeled/controller/labeled';
import {LabeledProps} from '../../labeled/view/labeled';
import {Blade} from '../model/blade';

interface Config<T> {
	binding: MonitorBinding<T>;
	blade: Blade;
	props: LabeledProps;
	valueController: ValueController<Buffer<T>>;
}

/**
 * @hidden
 */
export class MonitorBindingController<T> extends LabeledController<
	ValueController<Buffer<T>>
> {
	public readonly binding: MonitorBinding<T>;

	constructor(doc: Document, config: Config<T>) {
		super(doc, config);

		this.binding = config.binding;
		bindDisabled(this.viewProps, this.binding.ticker);
	}

	public onDispose() {
		this.binding.dispose();
		super.onDispose();
	}
}
