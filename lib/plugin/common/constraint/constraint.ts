/**
 * A constraint for the value.
 * @template T The type of the value.
 */
export interface Constraint<T> {
	/**
	 * Constrains the value.
	 * @param value The value.
	 * @return A constarined value.
	 */
	constrain(value: T): T;
}
