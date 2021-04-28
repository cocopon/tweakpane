import {Emitter} from './emitter';
import {Value, ValueEvents} from './value';
import {createValue} from './values';

export interface ValueMapEvents<O extends Record<string, unknown>> {
	change: {
		key: keyof O;
		sender: ValueMap<O>;
	};
}

export type ValueMapCore<O extends Record<string, unknown>> = {
	[Key in keyof O]: Value<O[Key]>;
};

export class ValueMap<O extends Record<string, unknown>> {
	public readonly emitter: Emitter<ValueMapEvents<O>> = new Emitter();
	private valMap_: ValueMapCore<O>;

	constructor(valueMap: ValueMapCore<O>) {
		this.valMap_ = valueMap;

		for (const key in this.valMap_) {
			const v = this.valMap_[key];
			v.emitter.on('change', () => {
				this.emitter.emit('change', {
					key: key,
					sender: this,
				});
			});
		}
	}

	public static createCore<O extends Record<string, unknown>>(
		initialValue: O,
	): ValueMapCore<O> {
		const keys: (keyof O)[] = Object.keys(initialValue);
		return keys.reduce((o, key) => {
			key;
			return Object.assign(o, {
				[key]: createValue(initialValue[key]),
			});
		}, {} as {[Key in keyof O]: Value<O[Key]>});
	}

	public static fromObject<O extends Record<string, unknown>>(
		initialValue: O,
	): ValueMap<O> {
		const core = this.createCore(initialValue);
		return new ValueMap(core);
	}

	public get<Key extends keyof O>(key: Key): O[Key] {
		return this.valMap_[key].rawValue;
	}

	public set<Key extends keyof O>(key: Key, value: O[Key]): void {
		this.valMap_[key].rawValue = value;
	}

	public value<Key extends keyof O>(key: Key): Value<O[Key]> {
		return this.valMap_[key];
	}

	// TODO: Remove in the next major version
	/** @deprecated Use ValueMap.value.emitter instead. */
	public valueEmitter<Key extends keyof O>(
		key: Key,
	): Emitter<ValueEvents<O[Key]>> {
		console.warn(
			`ValueMap.valueEmitter is deprecated. Use ValueMap.value.emitter instead.\nThis polyfill will be removed in the next major version.`,
		);
		return this.valMap_[key].emitter;
	}
}
