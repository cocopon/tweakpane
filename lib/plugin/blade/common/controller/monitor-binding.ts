import {MonitorBinding} from '../../../common/binding/monitor';
import {ValueController} from '../../../common/controller/value';
import {Buffer} from '../../../common/model/buffered-value';
import {LabeledView} from '../../labeled/view';
import {Blade} from '../model/blade';
import {BladeController, setUpBladeView} from './blade';

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

		this.view = new LabeledView(doc, {
			label: config.label,
		});
		this.view.valueElement.appendChild(this.controller.view.element);

		this.blade = config.blade;
		this.blade.emitter.on('dispose', () => {
			this.binding.dispose();
		});
		setUpBladeView(this.view, this.blade);
	}
}
