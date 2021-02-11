import {InputBinding} from '../binding/input';
import {ViewModel} from '../model/view-model';
import {LabeledView} from '../view/labeled';
import {InputController} from './input/input';

interface Config<In, Ex> {
	binding: InputBinding<In, Ex>;
	controller: InputController<In>;
	label: string;
}

/**
 * @hidden
 */
export class InputBindingController<In, Ex> {
	public readonly binding: InputBinding<In, Ex>;
	public readonly controller: InputController<In>;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In, Ex>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(document, {
			model: this.controller.viewModel,
			label: config.label,
			view: this.controller.view,
		});
	}

	get viewModel(): ViewModel {
		return this.controller.viewModel;
	}
}
