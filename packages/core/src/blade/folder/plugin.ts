import {ValueMap} from '../../common/model/value-map';
import {BaseBladeParams} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {BladePlugin} from '../plugin';
import {FolderApi} from './api/folder';
import {FolderController} from './controller/folder';
import {FolderPropsObject} from './view/folder';

export interface FolderBladeParams extends BaseBladeParams {
	title: string;
	view: 'folder';

	expanded?: boolean;
}

export const FolderBladePlugin: BladePlugin<FolderBladeParams> = {
	id: 'folder',
	type: 'blade',
	accept(params) {
		const p = ParamsParsers;
		const result = parseParams<FolderBladeParams>(params, {
			title: p.required.string,
			view: p.required.constant('folder'),

			expanded: p.optional.boolean,
		});
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
};
