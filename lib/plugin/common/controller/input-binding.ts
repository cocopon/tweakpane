import {LabeledView} from '../../general/labeled/view';
import {InputBinding} from '../binding/input';
import {Blade} from '../model/blade';
import {BladeController, setUpBladeView} from './blade';
import {ValueController} from './value';

interface Config<In, Ex> {
	binding: InputBinding<In, Ex>;
	controller: ValueController<In>;
	label: string;
	blade: Blade;
}

/**
 * @hidden
 */
export class InputBindingController<In, Ex> implements BladeController {
	public readonly binding: InputBinding<In, Ex>;
	public readonly controller: ValueController<In>;
	public readonly view: LabeledView;
	public readonly blade: Blade;

	constructor(doc: Document, config: Config<In, Ex>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(doc, {
			label: config.label,
			view: this.controller.view,
		});
		this.blade = config.blade;
		setUpBladeView(this.view, this.blade);
	}
}
