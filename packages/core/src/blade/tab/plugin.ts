import {ValueMap} from '../../common/model/value-map';
import {BaseBladeParams} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {BladePlugin} from '../plugin';
import {TabApi} from './api/tab';
import {TabController} from './controller/tab';
import {TabPageController, TabPagePropsObject} from './controller/tab-page';
import {TabItemPropsObject} from './view/tab-item';

export interface TabBladeParams extends BaseBladeParams {
	pages: {
		title: string;
	}[];
	view: 'tab';
}

export const TabBladePlugin: BladePlugin<TabBladeParams> = {
	id: 'tab',
	type: 'blade',
	accept(params) {
		const p = ParamsParsers;
		const result = parseParams<TabBladeParams>(params, {
			pages: p.required.array(p.required.object({title: p.required.string})),
			view: p.required.constant('tab'),
		});
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
				itemProps: ValueMap.fromObject<TabItemPropsObject>({
					selected: false,
					title: p.title,
				}),
				props: ValueMap.fromObject<TabPagePropsObject>({
					selected: false,
				}),
			});
			c.add(pc);
		});
		return c;
	},
	api(args) {
		if (!(args.controller instanceof TabController)) {
			return null;
		}
		return new TabApi(args.controller, args.pool);
	},
};
