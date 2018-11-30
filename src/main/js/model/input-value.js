// @flow

import Emitter from '../misc/emitter';
import type {Constraint} from '../constraint/constraint';

type EventType = 'change';

export default class InputValue<T> {
	+emitter: Emitter<EventType>;
	constraint_: ?Constraint<T>;
	rawValue_: T;

	constructor(initialValue: T, constraint?: Constraint<T>) {
		this.constraint_ = constraint;
		this.emitter = new Emitter();
		this.rawValue_ = initialValue;
	}

	get constraint(): ?Constraint<T> {
		return this.constraint_;
	}

	get rawValue(): T {
		return this.rawValue_;
	}

	static equalsValue(v1: T, v2: T): boolean {
		return v1 === v2;
	}

	set rawValue(rawValue: T): void {
		const constrainedValue = this.constraint_
			? this.constraint_.constrain(rawValue)
			: rawValue;

		const changed = !this.constructor.equalsValue(
			this.rawValue_,
			constrainedValue,
		);
		if (changed) {
			this.rawValue_ = constrainedValue;
			this.emitter.emit('change', [constrainedValue]);
		}
	}
}
