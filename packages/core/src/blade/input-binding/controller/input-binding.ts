import {Binding} from '../../../common/binding/binding';
import {ValueController} from '../../../common/controller/value';
import {View} from '../../../common/view/view';
import {Blade} from '../../common/model/blade';
import {LabeledValueController} from '../../label/controller/value-label';
import {LabelProps} from '../../label/view/label';

interface Config<In> {
	binding: Binding<In>;
	blade: Blade;
	props: LabelProps;
	valueController: ValueController<In, View>;
}

/**
 * @hidden
 */
export class InputBindingController<In> extends LabeledValueController<
	In,
	ValueController<In, View>
> {
	public readonly binding: Binding<In>;

	constructor(doc: Document, config: Config<In>) {
		super(doc, config);

		this.binding = config.binding;
	}
}
