// @flow

export default class View {
	+document: Document;
	+element: HTMLElement;

	constructor(document: Document) {
		this.document = document;
		this.element = this.document.createElement('div');
	}
}
