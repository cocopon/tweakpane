import {ValueMap} from '../../common/model/value-map';
import {findStringParam} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {LabeledController} from '../labeled/controller/labeled';
import {BladePlugin} from '../plugin';
import {ButtonApi} from './api/button';
import {ButtonController} from './controller/button';

export interface ButtonBladeParams extends BladeParams {
	title: string;
	view: 'button';

	label?: string;
}

export const ButtonBladePlugin: BladePlugin<ButtonBladeParams> = {
	id: 'button',
	accept(params) {
		if (findStringParam(params, 'view') !== 'button') {
			return null;
		}

		const title = findStringParam(params, 'title');
		if (title === undefined) {
			return null;
		}
		return {
			params: {
				label: findStringParam(params, 'label'),
				title: title,
				view: 'button',
			},
		};
	},
	api(args) {
		const c = new LabeledController(args.document, {
			blade: args.blade,
			props: new ValueMap({
				label: args.params.label,
			}),
			valueController: new ButtonController(args.document, {
				props: new ValueMap({
					title: args.params.title,
				}),
				viewProps: args.viewProps,
			}),
		});
		return new ButtonApi(c);
	},
};
