import {
	InputBindingValue,
	isInputBindingValue,
} from '../../../common/binding/value/input-binding.js';
import {ValueController} from '../../../common/controller/value.js';
import {BladeController} from '../../common/controller/blade.js';
import {
	BladeState,
	importBladeState,
} from '../../common/controller/blade-state.js';
import {isValueBladeController} from '../../common/controller/value-blade.js';
import {BindingController} from './binding.js';

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
				binding: p.required.object({
					value: p.required.raw,
				}),
			}),
			(result) => {
				this.value.binding.inject(result.binding.value);
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
