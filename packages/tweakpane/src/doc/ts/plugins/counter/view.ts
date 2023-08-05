import {Value, View, ViewProps} from '@tweakpane/core';

interface Config {
	value: Value<number>;
	viewProps: ViewProps;
}

export class CounterView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;

	constructor(doc: Document, config: Config) {
		// Create view elements
		this.element = doc.createElement('div');
		this.element.classList.add('tp-counter');

		// Apply value changes to the preview element
		const previewElem = doc.createElement('div');
		const value = config.value;
		value.emitter.on('change', () => {
			previewElem.textContent = String(value.rawValue);
		});
		previewElem.textContent = String(value.rawValue);
		this.element.appendChild(previewElem);

		// Create a button element for user interaction
		const buttonElem = doc.createElement('button');
		buttonElem.textContent = '+';
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;
	}
}
