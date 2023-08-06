import {parseRecord} from '../../common/micro-parsers.js';
import {ValueMap} from '../../common/model/value-map.js';
import {BaseBladeParams} from '../../common/params.js';
import {createPlugin} from '../../plugin/plugin.js';
import {BladePlugin} from '../plugin.js';
import {FolderApi} from './api/folder.js';
import {FolderController} from './controller/folder.js';
import {FolderPropsObject} from './view/folder.js';

export interface FolderBladeParams extends BaseBladeParams {
	title: string;
	view: 'folder';

	expanded?: boolean;
}

export const FolderBladePlugin: BladePlugin<FolderBladeParams> = createPlugin({
	id: 'folder',
	type: 'blade',
	accept(params) {
		const result = parseRecord<FolderBladeParams>(params, (p) => ({
			title: p.required.string,
			view: p.required.constant('folder'),

			expanded: p.optional.boolean,
		}));
		return result ? {params: result} : null;
	},
	controller(args) {
		return new FolderController(args.document, {
			blade: args.blade,
			expanded: args.params.expanded,
			props: ValueMap.fromObject<FolderPropsObject>({
				title: args.params.title,
			}),
			viewProps: args.viewProps,
		});
	},
	api(args) {
		if (!(args.controller instanceof FolderController)) {
			return null;
		}
		return new FolderApi(args.controller, args.pool);
	},
});
