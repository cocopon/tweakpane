// @flow

import InputBinding from '../binding/input';
import LabeledView from '../view/labeled';

import type {InputController} from './input/input';

type Config<In, Out> = {
	binding: InputBinding<In, Out>,
	controller: InputController<In>,
	label: string,
};

export default class InputBindingController<In, Out> {
	binding_: InputBinding<In, Out>;
	controller_: InputController<In>;
	labeledView_: LabeledView;

	constructor(document: Document, config: Config<In, Out>) {
		this.binding_ = config.binding;
		this.controller_ = config.controller;

		this.labeledView_ = new LabeledView(document, {
			label: config.label,
			view: this.controller_.view,
		});
	}

	get binding(): InputBinding<In, Out> {
		return this.binding_;
	}

	get controller(): InputController<In> {
		return this.controller_;
	}

	get view(): LabeledView {
		return this.labeledView_;
	}
}
