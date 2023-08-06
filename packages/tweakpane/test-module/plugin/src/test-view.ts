import {ClassName, Value, View} from '@tweakpane/core';

export class TestView implements View {
	public readonly element: HTMLElement;

	constructor(
		doc: Document,
		config: {
			value: Value<string>;
		},
	) {
		this.element = doc.createElement('div');
		this.element.classList.add(ClassName('tst')());
		config.value.emitter.on('change', (ev) => {
			this.element.textContent = ev.rawValue;
		});
		this.element.textContent = config.value.rawValue;
	}
}
