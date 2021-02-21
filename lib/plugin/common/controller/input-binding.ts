import {LabeledView} from '../../general/labeled/view';
import {InputBinding} from '../binding/input';
import {ViewModel} from '../model/view-model';
import {BladeController, setUpBladeView} from './blade';
import {ValueController} from './value';

interface Config<In, Ex> {
	binding: InputBinding<In, Ex>;
	controller: ValueController<In>;
	label: string;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class InputBindingController<In, Ex> implements BladeController {
	public readonly binding: InputBinding<In, Ex>;
	public readonly controller: ValueController<In>;
	public readonly view: LabeledView;
	public readonly viewModel: ViewModel;

	constructor(doc: Document, config: Config<In, Ex>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(doc, {
			label: config.label,
			view: this.controller.view,
		});
		this.viewModel = config.viewModel;
		setUpBladeView(this.view, this.viewModel);
	}
}
