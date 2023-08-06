import {LabelPropsObject} from '../../common/label/view/label.js';
import {parseRecord} from '../../common/micro-parsers.js';
import {ValueMap} from '../../common/model/value-map.js';
import {BaseBladeParams} from '../../common/params.js';
import {createPlugin} from '../../plugin/plugin.js';
import {BladePlugin} from '../plugin.js';
import {ButtonApi} from './api/button.js';
import {ButtonBladeController} from './controller/button-blade.js';
import {ButtonPropsObject} from './view/button.js';

export interface ButtonBladeParams extends BaseBladeParams {
	title: string;
	view: 'button';

	label?: string;
}

export const ButtonBladePlugin: BladePlugin<ButtonBladeParams> = createPlugin({
	id: 'button',
	type: 'blade',
	accept(params) {
		const result = parseRecord<ButtonBladeParams>(params, (p) => ({
			title: p.required.string,
			view: p.required.constant('button'),

			label: p.optional.string,
		}));
		return result ? {params: result} : null;
	},
	controller(args) {
		return new ButtonBladeController(args.document, {
			blade: args.blade,
			buttonProps: ValueMap.fromObject<ButtonPropsObject>({
				title: args.params.title,
			}),
			labelProps: ValueMap.fromObject<LabelPropsObject>({
				label: args.params.label,
			}),
			viewProps: args.viewProps,
		});
	},
	api(args) {
		if (args.controller instanceof ButtonBladeController) {
			return new ButtonApi(args.controller);
		}
		return null;
	},
});
