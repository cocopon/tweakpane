import {SeparatorView} from '../view/separator';

/**
 * @hidden
 */
export class SeparatorController {
	public readonly view: SeparatorView;

	constructor(document: Document) {
		this.view = new SeparatorView(document);
	}

	public dispose(): void {
		this.view.disposable.dispose();
	}
}
