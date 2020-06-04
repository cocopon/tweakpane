import {InputBinding} from '../binding/input';
import {ViewModel} from '../model/view-model';
import {LabeledView} from '../view/labeled';
import {ControllerConfig} from './controller';
import {InputController} from './input/input';

interface Config<In, Out> extends ControllerConfig {
	binding: InputBinding<In, Out>;
	controller: InputController<In>;
	label: string;
}

/**
 * @hidden
 */
export class InputBindingController<In, Out> {
	public readonly viewModel: ViewModel;
	public readonly binding: InputBinding<In, Out>;
	public readonly controller: InputController<In>;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In, Out>) {
		this.binding = config.binding;
		this.controller = config.controller;
		this.viewModel = config.viewModel;

		this.view = new LabeledView(document, {
			model: this.viewModel,
			label: config.label,
			view: this.controller.view,
		});
	}
}
