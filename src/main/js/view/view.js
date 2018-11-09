// @flow

export default class View {
	doc_: Document
	elem_: HTMLElement;

	constructor(document: Document) {
		this.doc_ = document;
		this.elem_ = this.doc_.createElement('div');
	}

	get document(): Document {
		return this.doc_;
	}

	get element(): HTMLElement {
		return this.elem_;
	}
}
