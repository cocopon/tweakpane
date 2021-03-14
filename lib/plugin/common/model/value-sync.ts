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

	primary.emitter.on('change', () => {
		preventFeedback(() => {
			secondary.rawValue = forward(primary, secondary);
		});
	});
	secondary.emitter.on('change', () => {
		preventFeedback(() => {
			primary.rawValue = backward(primary, secondary);
		});

		// Re-update secondary value
		// to apply change from constraint of primary value
		preventFeedback(() => {
			secondary.rawValue = forward(primary, secondary);
		});
	});

	preventFeedback(() => {
		secondary.rawValue = forward(primary, secondary);
	});
}
