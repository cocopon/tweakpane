import {
	InputBindingValue,
	isInputBindingValue,
} from '../../../common/binding/value/input-binding';
import {ValueController} from '../../../common/controller/value';
import {
	BladeController,
	BladeControllerState,
	exportBladeControllerState,
	importBladeControllerState,
} from '../../common/controller/blade';
import {isValueBladeController} from '../../common/controller/value-blade';
import {LabeledValueController} from '../../label/controller/value-label';

function excludeValue(
	state: BladeControllerState,
): Omit<BladeControllerState, 'value'> {
	const result = {
		...state,
	};
	delete result.value;
	return result;
}

export class InputBindingController<
	In = unknown,
	Vc extends ValueController<In> = ValueController<In>,
> extends LabeledValueController<In, Vc, InputBindingValue<In>> {
	override import(state: BladeControllerState): boolean {
		return importBladeControllerState(
			state,
			// Exclude `value` from super.import()
			// value should be imported with binding
			(_s) => super.import(excludeValue(state)),
			(p) => ({
				value: p.required.raw,
			}),
			(result) => {
				this.value.binding.inject(result.value);
				this.value.fetch();
				return true;
			},
		);
	}

	override export(): BladeControllerState {
		return exportBladeControllerState(() => super.export(), {
			key: this.value.binding.presetKey,
			value: this.value.binding.target.read(),
		});
	}
}

export function isInputBindingController(
	bc: BladeController,
): bc is InputBindingController {
	return isValueBladeController(bc) && isInputBindingValue(bc.value);
}
