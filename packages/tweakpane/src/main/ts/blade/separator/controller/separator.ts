import {Blade, BladeController, ViewProps} from '@tweakpane/core';

import {SeparatorView} from '../view/separator';

/**
 * @hidden
 */
interface Config {
	blade: Blade;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SeparatorController extends BladeController<SeparatorView> {
	/**
	 * @hidden
	 */
	constructor(doc: Document, config: Config) {
		super({
			...config,
			view: new SeparatorView(doc, {
				viewProps: config.viewProps,
			}),
		});
	}
}
