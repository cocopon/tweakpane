// @flow

import ClassName from '../misc/class-name';
import View from './view';

const className = ClassName('spt');

export default class SeparatorView extends View {
	constructor(document: Document) {
		super(document);

		this.element.classList.add(className());

		const hrElem = document.createElement('hr');
		hrElem.classList.add(className('r'));
		this.element.appendChild(hrElem);
	}
}
