import {InputBinding} from '../../../common/binding/input';
import {ValueController} from '../../../common/controller/value';
import {ViewProps} from '../../../common/model/view-props';
import {LabeledView} from '../../labeled/view';
import {Blade} from '../model/blade';
import {BladeController, setUpBladeController} from './blade';

interface Config<In> {
	binding: InputBinding<In>;
	controller: ValueController<In>;
	label: string;
	blade: Blade;
}

/**
 * @hidden
 */
export class InputBindingController<In> implements BladeController {
	public readonly binding: InputBinding<In>;
	public readonly controller: ValueController<In>;
	public readonly view: LabeledView;
	public readonly blade: Blade;

	constructor(doc: Document, config: Config<In>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(doc, {
			label: config.label,
			viewProps: this.viewProps,
		});
		this.view.valueElement.appendChild(this.controller.view.element);

		this.blade = config.blade;
		setUpBladeController(this);
	}

	get viewProps(): ViewProps {
		return this.controller.viewProps;
	}

	public onDispose() {
		if (this.controller.onDispose) {
			this.controller.onDispose();
		}
		if (this.controller.view.onDispose) {
			this.controller.view.onDispose();
		}
	}
}
