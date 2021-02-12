import {ViewModel} from '../model/view-model';
import {SeparatorView} from '../view/separator';

interface Config {
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class SeparatorController {
	public readonly viewModel: ViewModel;
	public readonly view: SeparatorView;

	constructor(document: Document, config: Config) {
		this.viewModel = config.viewModel;
		this.view = new SeparatorView(document, {
			model: this.viewModel,
		});
	}
}
