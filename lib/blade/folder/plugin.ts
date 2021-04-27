import {ValueMap} from '../../common/model/value-map';
import {ParamsParsers, parseParams} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {BladePlugin} from '../plugin';
import {FolderApi} from './api/folder';
import {FolderController} from './controller/folder';
import {FolderPropsObject} from './view/folder';

export interface FolderBladeParams extends BladeParams {
	title: string;
	view: 'folder';

	expanded?: boolean;
}

export const FolderBladePlugin: BladePlugin<FolderBladeParams> = {
	id: 'button',
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
	api(controller) {
		if (!(controller instanceof FolderController)) {
			return null;
		}
		return new FolderApi(controller);
	},
};
