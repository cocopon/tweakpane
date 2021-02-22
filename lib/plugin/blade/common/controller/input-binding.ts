import {InputBinding} from '../../../common/binding/input';
import {ValueController} from '../../../common/controller/value';
import {LabeledView} from '../../labeled/view';
import {Blade} from '../model/blade';
import {BladeController, setUpBladeView} from './blade';

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
