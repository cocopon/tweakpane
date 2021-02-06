import {InputParams} from '../api/types';
import {InputBinding} from '../binding/input';
import {InputBindingController} from '../controller/input-binding';
import {InputController} from '../controller/input/input';
import {Target} from '../model/target';

interface BindingParams<Ex> {
	target: Target;
	initialValue: Ex;
	inputParams: InputParams;
}

interface ControllerParams<In, Ex> {
	binding: InputBinding<In, Ex>;
	document: Document;
	initialValue: Ex;
	inputParams: InputParams;
}

export interface InputBindingPlugin<In, Ex> {
	getInitialValue: (value: unknown) => Ex | null;
	createBinding: (params: BindingParams<Ex>) => InputBinding<In, Ex> | null;
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
	const initialValue = plugin.getInitialValue(params.target.read());
	if (initialValue === null) {
		return null;
	}

	const binding = plugin.createBinding({
		target: params.target,
		initialValue: initialValue,
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
			initialValue: initialValue,
			inputParams: params.inputParams,
		}),
		label: params.inputParams.label || params.target.key,
	});
}
