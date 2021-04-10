import {MonitorBinding} from '../../../common/binding/monitor';
import {ValueController} from '../../../common/controller/value';
import {Buffer} from '../../../common/model/buffered-value';
import {bindDisabled} from '../../../common/view/reactive';
import {LabelController} from '../../label/controller/label';
import {LabelProps} from '../../label/view/label';
import {Blade} from '../model/blade';

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
		bindDisabled(this.viewProps, this.binding.ticker);
	}

	public onDispose() {
		this.binding.dispose();
		super.onDispose();
	}
}
