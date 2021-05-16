import {ViewProps} from '../../../common/model/view-props';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {SeparatorView} from '../view/separator';

interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SeparatorController extends BladeController<SeparatorView> {
	constructor(doc: Document, config: Config) {
		super({
			...config,
			view: new SeparatorView(doc, {
				viewProps: config.viewProps,
			}),
		});
	}
}
