// @flow

import ClassName from '../misc/class-name';
import View from './view';

type Config = {
	label: string,
	view: View,
};

const className = ClassName('lbl');

export default class LabeledView extends View {
	label_: string;

	constructor(document: Document, config: Config) {
		super(document);

		this.label_ = config.label;

		this.element.classList.add(className());

		const labelElem = document.createElement('div');
		labelElem.classList.add(className('l'));
		labelElem.textContent = this.label_;
		this.element.appendChild(labelElem);

		const viewElem = document.createElement('div');
		viewElem.classList.add(className('v'));
		viewElem.appendChild(config.view.element);
		this.element.appendChild(viewElem);
	}

	get label(): string {
		return this.label_;
	}
}
