import {MonitorBinding} from '../../../common/binding/monitor';
import {Blade} from '../../common/model/blade';
import {
	LabelableController,
	LabelController,
} from '../../label/controller/label';
import {LabelProps} from '../../label/view/label';

interface Config<T> {
	binding: MonitorBinding<T>;
	blade: Blade;
	props: LabelProps;
	valueController: LabelableController;
}

/**
 * @hidden
 */
export class MonitorBindingController<T> extends LabelController<
	LabelableController
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
