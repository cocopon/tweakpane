import {Value} from './value';

/**
 * @hidden
 */
export function connect<T1, T2>({
	primary,
	secondary,
	forward,
	backward,
}: {
	primary: Value<T1>;
	secondary: Value<T2>;
	forward: (primary: Value<T1>, secondary: Value<T2>) => T2;
	backward: (primary: Value<T1>, secondary: Value<T2>) => T1;
}) {
	primary.emitter.on('change', () => {
		secondary.rawValue = forward(primary, secondary);
	});
	secondary.emitter.on('change', () => {
		primary.rawValue = backward(primary, secondary);
	});
	secondary.rawValue = forward(primary, secondary);
}
