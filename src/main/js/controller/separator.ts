import SeparatorView from '../view/separator';

export default class SeparatorController {
	public readonly view: SeparatorView;

	constructor(document: Document) {
		this.view = new SeparatorView(document);
	}
}
