import {LabeledView} from '../../general/labeled/view';
import {MonitorBinding} from '../binding/monitor';
import {Blade} from '../model/blade';
import {Buffer} from '../model/buffered-value';
import {BladeController, setUpBladeView} from './blade';
import {ValueController} from './value';

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
			view: this.controller.view,
		});

		this.blade = config.blade;
		this.blade.emitter.on('dispose', () => {
			this.binding.dispose();
		});
		setUpBladeView(this.view, this.blade);
	}
}
