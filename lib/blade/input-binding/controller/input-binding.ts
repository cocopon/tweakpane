import {InputBinding} from '../../../common/binding/input';
import {Blade} from '../../common/model/blade';
import {
	LabelableController,
	LabelController,
} from '../../label/controller/label';
import {LabelProps} from '../../label/view/label';

interface Config<In> {
	binding: InputBinding<In>;
	blade: Blade;
	props: LabelProps;
	valueController: LabelableController;
}

/**
 * @hidden
 */
export class InputBindingController<In> extends LabelController<
	LabelableController
> {
	public readonly binding: InputBinding<In>;

	constructor(doc: Document, config: Config<In>) {
		super(doc, config);

		this.binding = config.binding;
	}
}
