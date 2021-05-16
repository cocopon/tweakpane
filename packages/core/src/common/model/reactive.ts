import {Value, ValueEvents} from '../model/value';
import {ValueMap} from '../model/value-map';

function compose<A, B, C>(
	h1: (input: A) => B,
	h2: (input: B) => C,
): (input: A) => C {
	return (input) => h2(h1(input));
}

function extractValue<T>(ev: ValueEvents<T>['change']): T {
	return ev.rawValue;
}

export function bindValue<T>(value: Value<T>, applyValue: (value: T) => void) {
	value.emitter.on('change', compose(extractValue, applyValue));
	applyValue(value.rawValue);
}

export function bindValueMap<
	O extends Record<string, unknown>,
	Key extends keyof O,
>(valueMap: ValueMap<O>, key: Key, applyValue: (value: O[Key]) => void) {
	bindValue(valueMap.value(key), applyValue);
}
