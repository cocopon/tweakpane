import {
	InputBindingValue,
	isInputBindingValue,
} from '../../../common/binding/value/input-binding';
import {ValueController} from '../../../common/controller/value';
import {BladeController} from '../../common/controller/blade';
import {
	BladeState,
	importBladeState,
} from '../../common/controller/blade-state';
import {isValueBladeController} from '../../common/controller/value-blade';
import {BindingController} from './binding';

/**
 * @hidden
 */
export class InputBindingController<
	In = unknown,
	Vc extends ValueController<In> = ValueController<In>,
> extends BindingController<In, Vc, InputBindingValue<In>> {
	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
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
}

export function isInputBindingController(
	bc: BladeController,
): bc is InputBindingController {
	return isValueBladeController(bc) && isInputBindingValue(bc.value);
}
