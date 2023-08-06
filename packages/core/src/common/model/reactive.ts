import {
	ReadonlyValue,
	ReadonlyValueEvents,
	Value,
	ValueEvents,
} from '../model/value.js';
import {ValueMap} from '../model/value-map.js';

export function bindValue<T>(
	value: Value<T> | ReadonlyValue<T>,
	applyValue: (value: T) => void,
) {
	value.emitter.on(
		'change',
		(ev: ValueEvents<T>['change'] | ReadonlyValueEvents<T>['change']) => {
			applyValue(ev.rawValue);
		},
	);
	applyValue(value.rawValue);
}

export function bindValueMap<
	O extends Record<string, unknown>,
	Key extends keyof O,
>(valueMap: ValueMap<O>, key: Key, applyValue: (value: O[Key]) => void) {
	bindValue(valueMap.value(key), applyValue);
}
