import {Constraint} from '../constraint/constraint';
import {Emitter} from './emitter';
import {Value, ValueChangeOptions, ValueEvents} from './value';

interface Config<T> {
	constraint?: Constraint<T>;
	equals?: (v1: T, v2: T) => boolean;
}

export class BoundValue<T> implements Value<T> {
	public readonly emitter: Emitter<ValueEvents<T>>;
	private readonly constraint_: Constraint<T> | undefined;
	private readonly equals_: (v1: T, v2: T) => boolean;
	private rawValue_: T;

	constructor(initialValue: T, config?: Config<T>) {
		this.constraint_ = config?.constraint;
		this.equals_ = config?.equals ?? ((v1, v2) => v1 === v2);
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
		this.setRawValue(rawValue, {
			forceEmit: false,
			last: true,
		});
	}

	public setRawValue(rawValue: T, options?: ValueChangeOptions): void {
		const opts = options ?? {
			forceEmit: false,
			last: true,
		};

		const constrainedValue = this.constraint_
			? this.constraint_.constrain(rawValue)
			: rawValue;

		const changed = !this.equals_(this.rawValue_, constrainedValue);
		if (!changed && !opts.forceEmit) {
			return;
		}

		this.emitter.emit('beforechange', {
			sender: this,
		});

		this.rawValue_ = constrainedValue;

		this.emitter.emit('change', {
			options: opts,
			rawValue: constrainedValue,
			sender: this,
		});
	}
}
