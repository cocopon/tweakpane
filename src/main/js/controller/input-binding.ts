import {InputBinding} from '../binding/input';
import {ViewModel} from '../model/view-model';
import {LabeledView} from '../view/labeled';
import {InputController} from './input/input';

interface Config<In, Out> {
	binding: InputBinding<In, Out>;
	controller: InputController<In>;
	label: string;
}

/**
 * @hidden
 */
export class InputBindingController<In, Out> {
	public readonly binding: InputBinding<In, Out>;
	public readonly controller: InputController<In>;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In, Out>) {
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
