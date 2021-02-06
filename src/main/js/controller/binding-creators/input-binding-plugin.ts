import {InputParams} from '../../api/types';
import {InputBinding} from '../../binding/input';
import {Target} from '../../model/target';
import {InputBindingController} from '../input-binding';
import {InputController} from '../input/input';

interface BindingParams {
	target: Target;
	inputParams: InputParams;
}

interface ControllerParams<In, Ex> {
	binding: InputBinding<In, Ex>;
	document: Document;
	inputParams: InputParams;
}

export interface InputBindingPlugin<In, Ex> {
	createBinding: (params: BindingParams) => InputBinding<In, Ex> | null;
	createController: (params: ControllerParams<In, Ex>) => InputController<In>;
}

interface Params {
	document: Document;
	inputParams: InputParams;
	target: Target;
}

export function createController<In, Ex>(
	plugin: InputBindingPlugin<In, Ex>,
	params: Params,
): InputBindingController<In, Ex> | null {
	const binding = plugin.createBinding({
		target: params.target,
		inputParams: params.inputParams,
	});
	if (!binding) {
		return null;
	}

	return new InputBindingController(params.document, {
		binding: binding,
		controller: plugin.createController({
			binding: binding,
			document: params.document,
			inputParams: params.inputParams,
		}),
		label: params.inputParams.label || params.target.key,
	});
}
