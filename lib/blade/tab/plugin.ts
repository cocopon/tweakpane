import {ValueMap} from '../../common/model/value-map';
import {findObjectArrayParam, findStringParam} from '../../common/params';
import {isEmpty} from '../../misc/type-util';
import {BladeParams} from '../common/api/types';
import {BladePlugin} from '../plugin';
import {TabApi} from './api/tab';
import {TabController} from './controller/tab';
import {TabPageController} from './controller/tab-page';

export interface TabBladeParams extends BladeParams {
	pages: {
		title: string;
	}[];
	view: 'tab';
}

export const TabBladePlugin: BladePlugin<TabBladeParams> = {
	id: 'tab',
	accept(params) {
		const pageObjs = findObjectArrayParam(params, 'pages');
		if (findStringParam(params, 'view') !== 'tab' || !pageObjs) {
			return null;
		}

		const pages = [];
		for (let i = 0; i < pageObjs.length; i++) {
			const title = findStringParam(pageObjs[i], 'title');
			if (isEmpty(title)) {
				return null;
			}
			pages.push({
				title: title,
			});
		}
		if (pages.length === 0) {
			return null;
		}

		return {
			params: {
				pages: pages,
				view: 'tab',
			},
		};
	},
	controller(args) {
		const c = new TabController(args.document, {
			blade: args.blade,
			viewProps: args.viewProps,
		});
		args.params.pages.forEach((p) => {
			const pc = new TabPageController(args.document, {
				itemProps: new ValueMap({
					selected: false as boolean,
					title: p.title,
				}),
				props: new ValueMap({
					selected: false as boolean,
				}),
			});
			c.add(pc);
		});
		return c;
	},
	api(controller) {
		if (!(controller instanceof TabController)) {
			return null;
		}
		return new TabApi(controller);
	},
};
