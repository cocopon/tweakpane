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
	+binding: InputBinding<In, Out>;
	+controller: InputController<In>;
	+view: LabeledView;

	constructor(document: Document, config: Config<In, Out>) {
		this.binding = config.binding;
		this.controller = config.controller;

		this.view = new LabeledView(document, {
			label: config.label,
			view: this.controller.view,
		});
	}
}
