import {Emitter} from './emitter';

interface ValueEvents<T> {
	change: {
		sender: Value<T>;
	};
}

// TODO: Integrate it with `./value`
class Value<T> {
	public readonly emitter: Emitter<ValueEvents<T>>;
	private value_: T;

	constructor(initialValue: T) {
		this.emitter = new Emitter();
		this.value_ = initialValue;
	}

	get value(): T {
		return this.value_;
	}

	set value(value: T) {
		if (this.value_ === value) {
			return;
		}

		this.value_ = value;
		this.emitter.emit('change', {
			sender: this,
		});
	}
}

export interface ValueMapEvents<O extends Record<string, unknown>> {
	change: {
		key: keyof O;
		sender: ValueMap<O>;
	};
}

export class ValueMap<O extends Record<string, unknown>> {
	public readonly emitter: Emitter<ValueMapEvents<O>>;
	private valMap_: {[Key in keyof O]: Value<O[Key]>};

	constructor(initialValue: O) {
		this.emitter = new Emitter();

		const keys: (keyof O)[] = Object.keys(initialValue);
		const props = keys.map((key) => new Value(initialValue[key]));
		props.forEach((prop, index) => {
			prop.emitter.on('change', () => {
				this.emitter.emit('change', {
					key: keys[index],
					sender: this,
				});
			});
		});

		this.valMap_ = keys.reduce((o, key, index) => {
			key;
			return Object.assign(o, {
				[key]: props[index],
			});
		}, {} as {[Key in keyof O]: Value<O[Key]>});
	}

	public get<Key extends keyof O>(key: Key): O[Key] {
		return this.valMap_[key].value;
	}

	public set<Key extends keyof O>(key: Key, value: O[Key]): void {
		this.valMap_[key].value = value;
	}
}
