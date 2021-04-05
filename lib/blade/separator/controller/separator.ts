import {ViewProps} from '../../../common/model/view-props';
import {
	BladeController,
	setUpBladeController,
} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {SeparatorView} from '../view/separator';

interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SeparatorController implements BladeController {
	public readonly blade: Blade;
	public readonly view: SeparatorView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.blade = config.blade;
		this.viewProps = config.viewProps;

		this.view = new SeparatorView(doc, {
			viewProps: this.viewProps,
		});
		setUpBladeController(this);
	}
}
