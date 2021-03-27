import {Controller} from '../../../common/controller/controller';
import {disposeElement} from '../../../common/disposing-util';
import {ClassName} from '../../../common/view/class-name';
import {Blade, BladeEvents} from '../model/blade';
import {getAllBladePositions} from '../model/blade-positions';

export interface BladeController extends Controller {
	readonly blade: Blade;
}

const className = ClassName('');

export function setUpBladeController(c: BladeController) {
	const elem = c.view.element;
	const blade = c.blade;

	blade.emitter.on('change', (ev: BladeEvents['change']) => {
		if (ev.propertyName === 'positions') {
			getAllBladePositions().forEach((pos) => {
				elem.classList.remove(className(undefined, pos));
			});
			blade.positions.forEach((pos) => {
				elem.classList.add(className(undefined, pos));
			});
		}
	});

	blade.emitter.on('dispose', () => {
		if (c.view.onDispose) {
			c.view.onDispose();
		}
		disposeElement(elem);

		if (c.onDispose) {
			c.onDispose();
		}
	});
}
