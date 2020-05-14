import {MonitorBinding} from '../binding/monitor';
import {Disposable} from '../model/disposable';
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
	public readonly disposable: Disposable;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.disposable = config.disposable;
		this.view = new LabeledView(document, {
			disposable: this.disposable,
			label: config.label,
			view: this.controller.view,
		});

		this.controller.disposable.emitter.on('dispose', () => {
			this.binding.dispose();
		});
	}
}
