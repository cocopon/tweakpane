import {InputBinding} from '../../../common/binding/input';
import {ValueController} from '../../../common/controller/value';
import {Blade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelProps} from '../../label/view/label';

interface Config<In> {
	binding: InputBinding<In>;
	blade: Blade;
	props: LabelProps;
	valueController: ValueController<In>;
}

/**
 * @hidden
 */
export class InputBindingController<In> extends LabelController<
	ValueController<In>
> {
	public readonly binding: InputBinding<In>;

	constructor(doc: Document, config: Config<In>) {
		super(doc, config);

		this.binding = config.binding;
	}
}
