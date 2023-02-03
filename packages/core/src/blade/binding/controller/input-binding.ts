import {InputBindingValue} from '../../../common/binding/value/input-binding';
import {ValueController} from '../../../common/controller/value';
import {LabeledValueController} from '../../label/controller/value-label';

export type InputBindingController<In> = LabeledValueController<
	In,
	ValueController<In>,
	InputBindingValue<In>
>;
