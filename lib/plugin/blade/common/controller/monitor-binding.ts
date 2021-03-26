import {MonitorBinding} from '../../../common/binding/monitor';
import {ValueController} from '../../../common/controller/value';
import {Buffer} from '../../../common/model/buffered-value';
import {ViewProps} from '../../../common/model/view-props';
import {bindDisabled} from '../../../common/view/reactive';
import {LabeledView} from '../../labeled/view';
import {Blade} from '../model/blade';
import {BladeController, setUpBladeController} from './blade';

interface Config<T> {
	binding: MonitorBinding<T>;
	controller: ValueController<Buffer<T>>;
	label: string;
	blade: Blade;
}

/**
 * @hidden
 */
export class MonitorBindingController<T> implements BladeController {
	public readonly binding: MonitorBinding<T>;
	public readonly controller: ValueController<Buffer<T>>;
	public readonly view: LabeledView;
	public readonly blade: Blade;

	constructor(doc: Document, config: Config<T>) {
		this.binding = config.binding;
		this.controller = config.controller;
		bindDisabled(this.viewProps, this.binding.ticker);

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
		this.binding.dispose();

		if (this.controller.onDispose) {
			this.controller.onDispose();
		}
		if (this.controller.view.onDispose) {
			this.controller.view.onDispose();
		}
	}
}
