import {Blade, FolderController, FolderProps, ViewProps} from '@tweakpane/core';

/**
 * @hidden
 */
interface Config {
	blade: Blade;
	props: FolderProps;
	viewProps: ViewProps;

	expanded?: boolean;
	title?: string;
}

/**
 * @hidden
 */
export class RootController extends FolderController {
	constructor(doc: Document, config: Config) {
		super(doc, {
			expanded: config.expanded,
			blade: config.blade,
			props: config.props,
			root: true,
			viewProps: config.viewProps,
		});
	}
}
