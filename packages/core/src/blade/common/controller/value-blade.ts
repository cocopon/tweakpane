import {ValueController} from '../../../common/controller/value.js';
import {BladeController} from './blade.js';

export function isValueBladeController(
	bc: BladeController,
): bc is BladeController & ValueController<unknown> {
	return 'value' in bc;
}
