import {ClassName, View, ViewProps} from '@tweakpane/core';

const cn = ClassName('spr');

/**
 * @hidden
 */
interface Config {
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SeparatorView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const hrElem = doc.createElement('hr');
		hrElem.classList.add(cn('r'));
		this.element.appendChild(hrElem);
	}
}
