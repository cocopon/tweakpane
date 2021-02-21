import {LabeledView} from '../../general/labeled/view';
import {MonitorBinding} from '../binding/monitor';
import {Buffer} from '../model/buffered-value';
import {ViewModel} from '../model/view-model';
import {BladeController, setUpBladeView} from './blade';
import {ValueController} from './value';

interface Config<T> {
	binding: MonitorBinding<T>;
	controller: ValueController<Buffer<T>>;
	label: string;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class MonitorBindingController<T> implements BladeController {
	public readonly binding: MonitorBinding<T>;
	public readonly controller: ValueController<Buffer<T>>;
	public readonly view: LabeledView;
	public readonly viewModel: ViewModel;

	constructor(doc: Document, config: Config<T>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(doc, {
			label: config.label,
			view: this.controller.view,
		});

		this.viewModel = config.viewModel;
		this.viewModel.emitter.on('dispose', () => {
			this.binding.dispose();
		});
		setUpBladeView(this.view, this.viewModel);
	}
}
