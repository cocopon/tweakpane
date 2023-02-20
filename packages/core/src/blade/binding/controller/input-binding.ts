import {
	InputBindingValue,
	isInputBindingValue,
} from '../../../common/binding/value/input-binding';
import {ValueController} from '../../../common/controller/value';
import {BladeController} from '../../common/controller/blade';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state';
import {isValueBladeController} from '../../common/controller/value-blade';
import {LabeledValueController} from '../../label/controller/value-label';

function excludeValue(state: BladeState): Omit<BladeState, 'value'> {
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
	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			// Exclude `value` from super.import()
			// value should be imported with binding
			(_s) => super.importState(excludeValue(state)),
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

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
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
