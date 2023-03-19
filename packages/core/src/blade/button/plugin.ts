import {LabelPropsObject} from '../../common/label/view/label';
import {parseRecord} from '../../common/micro-parsers';
import {ValueMap} from '../../common/model/value-map';
import {BaseBladeParams} from '../../common/params';
import {VERSION} from '../../version';
import {BladePlugin} from '../plugin';
import {ButtonApi} from './api/button';
import {ButtonBladeController} from './controller/button-blade';
import {ButtonPropsObject} from './view/button';

export interface ButtonBladeParams extends BaseBladeParams {
	title: string;
	view: 'button';

	label?: string;
}

export const ButtonBladePlugin: BladePlugin<ButtonBladeParams> = {
	id: 'button',
	type: 'blade',
	core: VERSION,
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
};
