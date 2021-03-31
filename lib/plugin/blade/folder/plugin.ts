import {BladePlugin} from '../../blade';
import {findBooleanParam, findStringParam} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {FolderApi} from './api/folder';
import {FolderController} from './controller/folder';

export interface FolderBladeParams extends BladeParams {
	title: string;
	view: 'folder';

	expanded?: boolean;
}

function createParams(
	params: Record<string, unknown>,
): FolderBladeParams | null {
	const title = findStringParam(params, 'title');
	if (title === undefined || findStringParam(params, 'view') !== 'folder') {
		return null;
	}

	return {
		expanded: findBooleanParam(params, 'expanded'),
		title: title,
		view: 'folder',
	};
}

export const FolderBladePlugin: BladePlugin<FolderBladeParams> = {
	id: 'button',
	accept(params) {
		const p = createParams(params);
		return p ? {params: p} : null;
	},
	api(args) {
		const c = new FolderController(args.document, {
			blade: args.blade,
			expanded: args.params.expanded,
			title: args.params.title,
			viewProps: args.viewProps,
		});
		return new FolderApi(c);
	},
};
