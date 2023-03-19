import {ValueController} from '../../../common/controller/value';
import {BladeController} from './blade';

export function isValueBladeController(
	bc: BladeController,
): bc is BladeController & ValueController<unknown> {
	return 'value' in bc;
}
