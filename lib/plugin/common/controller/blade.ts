import {disposeElement} from '../disposing-util';
import {ViewModel, ViewModelEvents} from '../model/view-model';
import {getAllViewPositions} from '../model/view-positions';
import {ClassName} from '../view/class-name';
import {View} from '../view/view';
import {Controller} from './controller';

export interface BladeController extends Controller {
	readonly viewModel: ViewModel;
}

const className = ClassName('');

export function setUpBladeView(view: View, model: ViewModel) {
	const elem = view.element;

	model.emitter.on('change', (ev: ViewModelEvents['change']) => {
		if (ev.propertyName === 'hidden') {
			const hiddenClass = className(undefined, 'hidden');
			if (model.hidden) {
				elem.classList.add(hiddenClass);
			} else {
				elem.classList.remove(hiddenClass);
			}
		} else if (ev.propertyName === 'positions') {
			getAllViewPositions().forEach((pos) => {
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
