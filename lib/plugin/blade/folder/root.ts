import {Blade} from '../common/model/blade';
import {FolderController} from './controller';

interface Config {
	expanded?: boolean;
	title?: string;
	blade: Blade;
}

export class RootController extends FolderController {
	constructor(doc: Document, config: Config) {
		super(doc, {
			expanded: config.expanded,
			title: config.title || '',
			blade: config.blade,

			hidesTitle: config.title === undefined,
			viewName: 'rot',
		});
	}
}
