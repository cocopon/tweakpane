import {Value} from './value.js';

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
	forward: (primary: T1, secondary: T2) => T2;
	backward: (primary: T1, secondary: T2) => T1;
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
			secondary.setRawValue(
				forward(primary.rawValue, secondary.rawValue),
				ev.options,
			);
		});
	});
	secondary.emitter.on('change', (ev) => {
		preventFeedback(() => {
			primary.setRawValue(
				backward(primary.rawValue, secondary.rawValue),
				ev.options,
			);
		});

		// Re-update secondary value
		// to apply change from constraint of primary value
		preventFeedback(() => {
			secondary.setRawValue(
				forward(primary.rawValue, secondary.rawValue),
				ev.options,
			);
		});
	});

	preventFeedback(() => {
		secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), {
			forceEmit: false,
			last: true,
		});
	});
}
