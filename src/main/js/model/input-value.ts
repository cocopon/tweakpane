import {Constraint} from '../constraint/constraint';
import {Emitter} from '../misc/emitter';

type EventType = 'change';

/**
 * @hidden
 */
export class InputValue<T> {
	public static equalsValue<T>(v1: T, v2: T): boolean {
		return v1 === v2;
	}

	public readonly emitter: Emitter<EventType>;
	private constraint_: Constraint<T> | undefined;
	private rawValue_: T;

	constructor(initialValue: T, constraint?: Constraint<T>) {
		this.constraint_ = constraint;
		this.emitter = new Emitter();
		this.rawValue_ = initialValue;
	}

	get constraint(): Constraint<T> | undefined {
		return this.constraint_;
	}

	get rawValue(): T {
		return this.rawValue_;
	}

	set rawValue(rawValue: T) {
		const constrainedValue = this.constraint_
			? this.constraint_.constrain(rawValue)
			: rawValue;

		const changed = !InputValue.equalsValue(this.rawValue_, constrainedValue);
		if (changed) {
			this.rawValue_ = constrainedValue;
			this.emitter.emit('change', [constrainedValue]);
		}
	}
}
