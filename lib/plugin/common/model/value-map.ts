import {Emitter} from './emitter';

export interface SingleValueEvents<T> {
	change: {
		sender: SingleValue<T>;
		value: T;
	};
}

// TODO: Integrate it with `./value`
class SingleValue<T> {
	public readonly emitter: Emitter<SingleValueEvents<T>>;
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
			value: this.value_,
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
	private valMap_: {[Key in keyof O]: SingleValue<O[Key]>};

	constructor(initialValue: O) {
		this.emitter = new Emitter();

		const keys: (keyof O)[] = Object.keys(initialValue);
		const props = keys.map((key) => new SingleValue(initialValue[key]));
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
		}, {} as {[Key in keyof O]: SingleValue<O[Key]>});
	}

	public get<Key extends keyof O>(key: Key): O[Key] {
		return this.valMap_[key].value;
	}

	public set<Key extends keyof O>(key: Key, value: O[Key]): void {
		this.valMap_[key].value = value;
	}

	public valueEmitter<Key extends keyof O>(
		key: Key,
	): Emitter<SingleValueEvents<O[Key]>> {
		return this.valMap_[key].emitter;
	}
}
