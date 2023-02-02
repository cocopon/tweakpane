import {Value} from '../../model/value';
import {BindingTarget} from '../target';

export interface BindingValue<T> extends Value<T> {
	readonly binding: {
		target: BindingTarget;
	};

	fetch(): void;
}
