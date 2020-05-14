import {InputBinding} from '../binding/input';
import {Disposable} from '../model/disposable';
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
	public readonly disposable: Disposable;
	public readonly binding: InputBinding<In, Out>;
	public readonly controller: InputController<In>;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In, Out>) {
		this.binding = config.binding;
		this.controller = config.controller;
		this.disposable = config.disposable;

		this.view = new LabeledView(document, {
			disposable: this.disposable,
			label: config.label,
			view: this.controller.view,
		});
	}
}
