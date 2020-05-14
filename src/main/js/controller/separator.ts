import {Disposable} from '../model/disposable';
import {SeparatorView} from '../view/separator';

interface Config {
	disposable: Disposable;
}

/**
 * @hidden
 */
export class SeparatorController {
	public readonly disposable: Disposable;
	public readonly view: SeparatorView;

	constructor(document: Document, config: Config) {
		this.disposable = config.disposable;
		this.view = new SeparatorView(document, {
			disposable: this.disposable,
		});
	}
}
