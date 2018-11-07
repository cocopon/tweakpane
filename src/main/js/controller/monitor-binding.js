// @flow

import MonitorBinding from '../binding/monitor';
import LabeledView from '../view/labeled';

import type {MonitorController} from './monitor/monitor';

type Config<In> = {
	binding: MonitorBinding<In>,
	controller: MonitorController<In>,
	label: string,
};

export default class MonitorBindingController<In> {
	binding_: MonitorBinding<In>;
	controller_: MonitorController<In>;
	labeledView_: LabeledView;

	constructor(document: Document, config: Config<In>) {
		this.binding_ = config.binding;
		this.controller_ = config.controller;

		this.labeledView_ = new LabeledView(document, {
			label: config.label,
			view: this.controller_.view,
		});
	}

	get binding(): MonitorBinding<In> {
		return this.binding_;
	}

	get controller(): MonitorController<In> {
		return this.controller_;
	}

	get view(): LabeledView {
		return this.labeledView_;
	}
}
