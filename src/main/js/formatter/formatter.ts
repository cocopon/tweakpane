export interface Formatter<T> {
	format(value: T): string;
}
