import {ValueMap} from '../../common/model/value-map';
import {ParamsParsers, parseParams} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {LabelController} from '../label/controller/label';
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
		const p = ParamsParsers;
		const result = parseParams<ButtonBladeParams>(params, {
			title: p.required.string,
			view: p.required.constant('button'),

			label: p.optional.string,
		});
		return result ? {params: result} : null;
	},
	controller(args) {
		return new LabelController(args.document, {
			blade: args.blade,
			props: ValueMap.fromObject({
				label: args.params.label,
			}),
			valueController: new ButtonController(args.document, {
				props: ValueMap.fromObject({
					title: args.params.title,
				}),
				viewProps: args.viewProps,
			}),
		});
	},
	api(controller) {
		if (!(controller instanceof LabelController)) {
			return null;
		}
		if (!(controller.valueController instanceof ButtonController)) {
			return null;
		}
		return new ButtonApi(controller);
	},
};
