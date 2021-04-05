import {InputBinding} from '../../../common/binding/input';
import {ValueController} from '../../../common/controller/value';
import {LabeledController} from '../../labeled/controller/labeled';
import {LabeledProps} from '../../labeled/view/labeled';
import {Blade} from '../model/blade';

interface Config<In> {
	binding: InputBinding<In>;
	blade: Blade;
	props: LabeledProps;
	valueController: ValueController<In>;
}

/**
 * @hidden
 */
export class InputBindingController<In> extends LabeledController<
	ValueController<In>
> {
	public readonly binding: InputBinding<In>;

	constructor(doc: Document, config: Config<In>) {
		super(doc, config);

		this.binding = config.binding;
	}
}
