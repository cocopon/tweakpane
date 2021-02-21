import {BladeController, setUpBladeView} from '../../common/controller/blade';
import {ViewModel} from '../../common/model/view-model';
import {SeparatorView} from './view';

interface Config {
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class SeparatorController implements BladeController {
	public readonly viewModel: ViewModel;
	public readonly view: SeparatorView;

	constructor(doc: Document, config: Config) {
		this.viewModel = config.viewModel;
		this.view = new SeparatorView(doc);
		setUpBladeView(this.view, this.viewModel);
	}
}
