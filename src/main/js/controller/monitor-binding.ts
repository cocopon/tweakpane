// @flow

import MonitorBinding from '../binding/monitor';
import LabeledView from '../view/labeled';

import {MonitorController} from './monitor/monitor';

interface Config<In> {
	binding: MonitorBinding<In>;
	controller: MonitorController<In>;
	label: string;
}

export default class MonitorBindingController<In> {
	public readonly binding: MonitorBinding<In>;
	public readonly controller: MonitorController<In>;
	public readonly view: LabeledView;

	constructor(document: Document, config: Config<In>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(document, {
			label: config.label,
			view: this.controller.view,
		});
	}
}
