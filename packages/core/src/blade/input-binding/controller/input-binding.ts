import {ValueController} from '../../../common/controller/value';
import {BindingValue} from '../../../common/model/binding-value';
import {Blade} from '../../common/model/blade';
import {LabeledValueController} from '../../label/controller/value-label';
import {LabelProps} from '../../label/view/label';

interface Config<In> {
	blade: Blade;
	props: LabelProps;
	value: BindingValue<In>;
	valueController: ValueController<In>;
}

/**
 * @hidden
 */
export class InputBindingController<In> extends LabeledValueController<
	In,
	ValueController<In>,
	BindingValue<In>
> {
	constructor(doc: Document, config: Config<In>) {
		super(doc, config);
	}
}
