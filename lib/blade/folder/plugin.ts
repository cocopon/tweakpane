import {ValueMap} from '../../common/model/value-map';
import {findBooleanParam, findStringParam} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {BladePlugin} from '../plugin';
import {FolderApi} from './api/folder';
import {FolderController} from './controller/folder';

export interface FolderBladeParams extends BladeParams {
	title: string;
	view: 'folder';

	expanded?: boolean;
}

export const FolderBladePlugin: BladePlugin<FolderBladeParams> = {
	id: 'button',
	accept(params) {
		const title = findStringParam(params, 'title');
		if (title === undefined || findStringParam(params, 'view') !== 'folder') {
			return null;
		}

		return {
			params: {
				expanded: findBooleanParam(params, 'expanded'),
				title: title,
				view: 'folder',
			},
		};
	},
	api(args) {
		const c = new FolderController(args.document, {
			blade: args.blade,
			expanded: args.params.expanded,
			props: new ValueMap({
				title: args.params.title as string | undefined,
			}),
			viewProps: args.viewProps,
		});
		return new FolderApi(c);
	},
};
