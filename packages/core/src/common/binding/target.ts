import {TpError} from '../tp-error.js';

export type Bindable = Record<string, any>;

/**
 * A binding target.
 */
export class BindingTarget {
	/**
	 * The property name of the binding.
	 */
	public readonly key: string;
	private readonly obj_: Bindable;

	/**
	 * @hidden
	 */
	constructor(obj: Bindable, key: string) {
		this.obj_ = obj;
		this.key = key;
	}

	public static isBindable(obj: unknown): obj is Bindable {
		if (obj === null) {
			return false;
		}
		if (typeof obj !== 'object' && typeof obj !== 'function') {
			return false;
		}
		return true;
	}

	/**
	 * Read a bound value.
	 * @return A bound value
	 */
	public read(): unknown {
		return this.obj_[this.key];
	}

	/**
	 * Write a value.
	 * @param value The value to write to the target.
	 */
	public write(value: unknown): void {
		this.obj_[this.key] = value;
	}

	/**
	 * Write a value to the target property.
	 * @param name The property name.
	 * @param value The value to write to the target.
	 */
	public writeProperty(name: string, value: unknown): void {
		const valueObj = this.read();

		if (!BindingTarget.isBindable(valueObj)) {
			throw TpError.notBindable();
		}
		if (!(name in valueObj)) {
			throw TpError.propertyNotFound(name);
		}
		valueObj[name] = value;
	}
}
