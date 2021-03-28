import {Emitter} from './emitter';
import {PrimitiveValue} from './primitive-value';
import {Value, ValueEvents} from './value';

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
		const props = keys.map((key) => new PrimitiveValue(initialValue[key]));
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
		return this.valMap_[key].rawValue;
	}

	public set<Key extends keyof O>(key: Key, value: O[Key]): void {
		this.valMap_[key].rawValue = value;
	}

	public valueEmitter<Key extends keyof O>(
		key: Key,
	): Emitter<ValueEvents<O[Key]>> {
		return this.valMap_[key].emitter;
	}
}
