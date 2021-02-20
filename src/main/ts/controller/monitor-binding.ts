import {MonitorBinding} from '../binding/monitor';
import {Buffer} from '../model/buffered-value';
import {ViewModel} from '../model/view-model';
import {LabeledView} from '../view/labeled';
import {ValueController} from './value/value';

interface Config<T> {
	binding: MonitorBinding<T>;
	controller: ValueController<Buffer<T>>;
	label: string;
}

/**
 * @hidden
 */
export class MonitorBindingController<T> {
	public readonly binding: MonitorBinding<T>;
	public readonly controller: ValueController<Buffer<T>>;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<T>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(document, {
			label: config.label,
			model: this.viewModel,
			view: this.controller.view,
		});

		this.viewModel.emitter.on('dispose', () => {
			this.binding.dispose();
		});
	}

	get viewModel(): ViewModel {
		return this.controller.viewModel;
	}
}
