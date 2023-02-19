import {
	InputBindingValue,
	isInputBindingValue,
} from '../../../common/binding/value/input-binding';
import {ValueController} from '../../../common/controller/value';
import {ParamsParsers, parseParams} from '../../../common/params-parsers';
import {
	BladeController,
	BladeControllerState,
} from '../../common/controller/blade';
import {isValueBladeController} from '../../common/controller/value-blade';
import {LabeledValueController} from '../../label/controller/value-label';

export class InputBindingController<
	In = unknown,
	Vc extends ValueController<In> = ValueController<In>,
> extends LabeledValueController<In, Vc, InputBindingValue<In>> {
	public import(state: BladeControllerState): void {
		super.import(state);

		const p = ParamsParsers;
		const result = parseParams(state, {
			value: p.required.raw,
		});
		if (!result) {
			return;
		}

		this.value.binding.inject(result.value);
		this.value.fetch();
	}

	public export(): BladeControllerState {
		return {
			...super.export(),
			key: this.value.binding.presetKey,
			value: this.value.binding.target.read(),
		};
	}
}

export function isInputBindingController(
	bc: BladeController,
): bc is InputBindingController {
	return isValueBladeController(bc) && isInputBindingValue(bc.value);
}
