import {ButtonApi} from '../../../api/button';
import {BladeParams} from '../../../api/types';
import {BladePlugin} from '../../blade';
import {findBooleanParam, findStringParam} from '../../common/params';
import {LabeledController} from '../labeled/controller';
import {ButtonController} from './controller/button';

export interface ButtonParams extends BladeParams {
	title: string;

	disabled?: boolean;
	label?: string;
	view: 'button';
}

function createButtonParams(
	params: Record<string, unknown>,
): ButtonParams | null {
	if (findStringParam(params, 'view') !== 'button') {
		return null;
	}

	const title = findStringParam(params, 'title');
	if (title === undefined) {
		return null;
	}
	return {
		disabled: findBooleanParam(params, 'disabled'),
		label: findStringParam(params, 'label'),
		title: title,
		view: 'button',
	};
}

export const ButtonBladePlugin: BladePlugin<ButtonParams> = {
	id: 'button',
	accept(params) {
		const p = createButtonParams(params);
		return p ? {params: p} : null;
	},
	api(args) {
		const c = new LabeledController(args.document, {
			blade: args.blade,
			valueController: new ButtonController(args.document, {
				title: args.params.title,
				viewProps: args.viewProps,
			}),
			label: args.params.label,
		});
		return new ButtonApi(c);
	},
};
