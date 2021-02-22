import {Controller} from '../../../common/controller/controller';
import {disposeElement} from '../../../common/disposing-util';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {Blade, BladeEvents} from '../model/blade';
import {getAllBladePositions} from '../model/blade-positions';

export interface BladeController extends Controller {
	readonly blade: Blade;
}

const className = ClassName('');

export function setUpBladeView(view: View, model: Blade) {
	const elem = view.element;

	model.emitter.on('change', (ev: BladeEvents['change']) => {
		if (ev.propertyName === 'hidden') {
			const hiddenClass = className(undefined, 'hidden');
			if (model.hidden) {
				elem.classList.add(hiddenClass);
			} else {
				elem.classList.remove(hiddenClass);
			}
		} else if (ev.propertyName === 'positions') {
			getAllBladePositions().forEach((pos) => {
				elem.classList.remove(className(undefined, pos));
			});
			model.positions.forEach((pos) => {
				elem.classList.add(className(undefined, pos));
			});
		}
	});

	model.emitter.on('dispose', () => {
		if (view.onDispose) {
			view.onDispose();
		}
		disposeElement(elem);
	});
}
