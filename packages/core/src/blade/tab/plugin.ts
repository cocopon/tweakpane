import {parseRecord} from '../../common/micro-parsers.js';
import {ValueMap} from '../../common/model/value-map.js';
import {ViewProps} from '../../common/model/view-props.js';
import {BaseBladeParams} from '../../common/params.js';
import {createPlugin} from '../../plugin/plugin.js';
import {createBlade} from '../common/model/blade.js';
import {BladePlugin} from '../plugin.js';
import {TabApi} from './api/tab.js';
import {TabPageApi} from './api/tab-page.js';
import {TabController} from './controller/tab.js';
import {TabPageController, TabPagePropsObject} from './controller/tab-page.js';
import {TabItemPropsObject} from './view/tab-item.js';

export interface TabBladeParams extends BaseBladeParams {
	pages: {
		title: string;
	}[];
	view: 'tab';
}

export const TabBladePlugin: BladePlugin<TabBladeParams> = createPlugin({
	id: 'tab',
	type: 'blade',
	accept(params) {
		const result = parseRecord<TabBladeParams>(params, (p) => ({
			pages: p.required.array(p.required.object({title: p.required.string})),
			view: p.required.constant('tab'),
		}));
		if (!result || result.pages.length === 0) {
			return null;
		}
		return {params: result};
	},
	controller(args) {
		const c = new TabController(args.document, {
			blade: args.blade,
			viewProps: args.viewProps,
		});
		args.params.pages.forEach((p) => {
			const pc = new TabPageController(args.document, {
				blade: createBlade(),
				itemProps: ValueMap.fromObject<TabItemPropsObject>({
					selected: false,
					title: p.title,
				}),
				props: ValueMap.fromObject<TabPagePropsObject>({
					selected: false,
				}),
				viewProps: ViewProps.create(),
			});
			c.add(pc);
		});
		return c;
	},
	api(args) {
		if (args.controller instanceof TabController) {
			return new TabApi(args.controller, args.pool);
		}
		if (args.controller instanceof TabPageController) {
			return new TabPageApi(args.controller, args.pool);
		}
		return null;
	},
});
