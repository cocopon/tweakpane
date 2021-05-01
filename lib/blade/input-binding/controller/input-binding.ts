import {InputBinding} from '../../../common/binding/input';
import {Controller} from '../../../common/controller/controller';
import {View} from '../../../common/view/view';
import {Blade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelProps} from '../../label/view/label';

interface Config<In> {
	binding: InputBinding<In>;
	blade: Blade;
	props: LabelProps;
	valueController: Controller<View>;
}

/**
 * @hidden
 */
export class InputBindingController<In> extends LabelController<
	Controller<View>
> {
	public readonly binding: InputBinding<In>;

	constructor(doc: Document, config: Config<In>) {
		super(doc, config);

		this.binding = config.binding;
	}
}
