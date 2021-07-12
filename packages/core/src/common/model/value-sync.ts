import {Value} from './value';

/**
 * Synchronizes two values.
 */
export function connectValues<T1, T2>({
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
	// Prevents an event firing loop
	// e.g.
	// primary changed
	// -> applies changes to secondary
	// -> secondary changed
	// -> applies changes to primary
	// -> ...
	let changing = false;
	function preventFeedback(callback: () => void) {
		if (changing) {
			return;
		}
		changing = true;
		callback();
		changing = false;
	}

	primary.emitter.on('change', (ev) => {
		preventFeedback(() => {
			secondary.setRawValue(forward(primary, secondary), ev.options);
		});
	});
	secondary.emitter.on('change', (ev) => {
		preventFeedback(() => {
			primary.setRawValue(backward(primary, secondary), ev.options);
		});

		// Re-update secondary value
		// to apply change from constraint of primary value
		preventFeedback(() => {
			secondary.setRawValue(forward(primary, secondary), ev.options);
		});
	});

	preventFeedback(() => {
		secondary.setRawValue(forward(primary, secondary), {
			forceEmit: false,
			last: true,
		});
	});
}
