import {MonitorBindingValue} from '../../../common/binding/value/monitor';
import {ValueController} from '../../../common/controller/value';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {View} from '../../../common/view/view';
import {Blade} from '../../common/model/blade';
import {LabeledValueController} from '../../label/controller/value-label';
import {LabelProps} from '../../label/view/label';

interface Config<T> {
	blade: Blade;
	props: LabelProps;
	value: MonitorBindingValue<T>;
	valueController: ValueController<Buffer<T>, View, BufferedValue<T>>;
}

/**
 * @hidden
 */
export class MonitorBindingController<T> extends LabeledValueController<
	Buffer<T>,
	ValueController<Buffer<T>>,
	MonitorBindingValue<T>
> {
	constructor(doc: Document, config: Config<T>) {
		super(doc, config);

		this.viewProps.bindDisabled(this.value.ticker);
		this.viewProps.handleDispose(() => {
			this.value.ticker.dispose();
		});
	}
}
