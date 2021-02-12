import {Emitter, EventTypeMap} from '../misc/emitter';

/**
 * @hidden
 */
export function connect<
	M1,
	M2,
	E1 extends EventTypeMap,
	E2 extends EventTypeMap
>({
	primary,
	secondary,
}: {
	primary: {
		apply: (from: M1, to: M2) => void;
		emitter: (m: M1) => Emitter<E1>;
		value: M1;
	};
	secondary: {
		apply: (from: M2, to: M1) => void;
		emitter: (m: M2) => Emitter<E2>;
		value: M2;
	};
}) {
	primary.emitter(primary.value).on('change', () => {
		primary.apply(primary.value, secondary.value);
	});
	secondary.emitter(secondary.value).on('change', () => {
		secondary.apply(secondary.value, primary.value);
	});
	primary.apply(primary.value, secondary.value);
}
