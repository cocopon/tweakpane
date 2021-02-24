import {BindingTarget} from '../plugin/common/binding/target';
import {TpError} from '../plugin/common/tp-error';

export function createBindingTarget(
	obj: unknown,
	key: string,
	opt_id?: string,
): BindingTarget {
	if (!BindingTarget.isBindable(obj)) {
		throw TpError.notBindable();
	}
	return new BindingTarget(obj, key, opt_id);
}
