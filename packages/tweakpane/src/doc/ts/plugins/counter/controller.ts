import {Value, ValueController, ViewProps} from '@tweakpane/core';

import {CounterView} from './view';

interface Config {
	value: Value<number>;
	viewProps: ViewProps;
}

export class CounterController implements ValueController<number, CounterView> {
	public readonly value: Value<number>;
	public readonly view: CounterView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		// Models
		this.value = config.value;
		this.viewProps = config.viewProps;

		// Create a view
		this.view = new CounterView(doc, {
			value: config.value,
			viewProps: this.viewProps,
		});

		// Handle user interaction
		this.view.buttonElement.addEventListener('click', () => {
			// Update a model
			this.value.rawValue += 1;
		});
	}
}
