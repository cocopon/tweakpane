import {MonitorBinding} from '../binding/monitor';
import {Buffer} from '../model/buffered-value';
import {ViewModel} from '../model/view-model';
import {LabeledView} from '../view/labeled';
import {ValueController} from './value/value';

interface Config<In> {
	binding: MonitorBinding<In>;
	controller: ValueController<Buffer<In>>;
	label: string;
}

/**
 * @hidden
 */
export class MonitorBindingController<In> {
	public readonly binding: MonitorBinding<In>;
	public readonly controller: ValueController<Buffer<In>>;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In>) {
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
