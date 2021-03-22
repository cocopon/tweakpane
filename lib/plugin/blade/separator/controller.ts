import {
	BladeController,
	setUpBladeController,
} from '../common/controller/blade';
import {Blade} from '../common/model/blade';
import {SeparatorView} from './view';

interface Config {
	blade: Blade;
}

/**
 * @hidden
 */
export class SeparatorController implements BladeController {
	public readonly blade: Blade;
	public readonly view: SeparatorView;

	constructor(doc: Document, config: Config) {
		this.blade = config.blade;
		this.view = new SeparatorView(doc);
		setUpBladeController(this);
	}
}
