/**
 * @hidden
 */
export interface Constraint<T> {
	constrain(value: T): T;
}
