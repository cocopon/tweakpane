import {MonitorBinding} from '../binding/monitor';
import {ViewModel} from '../model/view-model';
import {LabeledView} from '../view/labeled';
import {ControllerConfig} from './controller';
import {MonitorController} from './monitor/monitor';

interface Config<In> extends ControllerConfig {
	binding: MonitorBinding<In>;
	controller: MonitorController<In>;
	label: string;
}

/**
 * @hidden
 */
export class MonitorBindingController<In> {
	public readonly binding: MonitorBinding<In>;
	public readonly controller: MonitorController<In>;
	public readonly viewModel: ViewModel;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.viewModel = config.viewModel;
		this.view = new LabeledView(document, {
			label: config.label,
			model: this.viewModel,
			view: this.controller.view,
		});

		this.controller.viewModel.emitter.on('dispose', () => {
			this.binding.dispose();
		});
	}
}
