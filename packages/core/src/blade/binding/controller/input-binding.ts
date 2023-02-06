import {InputBindingValue} from '../../../common/binding/value/input-binding';
import {ValueController} from '../../../common/controller/value';
import {LabeledValueController} from '../../label/controller/value-label';

export type InputBindingController<
	In,
	Vc extends ValueController<In> = ValueController<In>,
> = LabeledValueController<In, Vc, InputBindingValue<In>>;
