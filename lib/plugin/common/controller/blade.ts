import {disposeElement} from '../disposing-util';
import {Blade, BladeEvents} from '../model/blade';
import {getAllBladePositions} from '../model/blade-positions';
import {ClassName} from '../view/class-name';
import {View} from '../view/view';
import {Controller} from './controller';

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
