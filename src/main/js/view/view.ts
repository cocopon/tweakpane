/**
 * @hidden
 */
export default class View {
	public readonly document: Document;
	public readonly element: HTMLElement;

	constructor(document: Document) {
		this.document = document;
		this.element = this.document.createElement('div');
	}
}
