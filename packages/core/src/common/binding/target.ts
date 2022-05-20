import {TpError} from '../tp-error';

export type Bindable = Record<string, any>;

/**
 * A binding target.
 */
export class BindingTarget {
	private readonly key_: string;
	private readonly obj_: Bindable;
	private readonly presetKey_: string;

	constructor(obj: Bindable, key: string, opt_id?: string) {
		this.obj_ = obj;
		this.key_ = key;
		this.presetKey_ = opt_id ?? key;
	}

	public static isBindable(obj: unknown): obj is Bindable {
		if (obj === null) {
			return false;
		}
		if (typeof obj !== 'object') {
			return false;
		}
		return true;
	}

	/**
	 * The property name of the binding.
	 */
	get key(): string {
		return this.key_;
	}

	/**
	 * The key used for presets.
	 */
	get presetKey(): string {
		return this.presetKey_;
	}

	/**
	 * Read a bound value.
	 * @return A bound value
	 */
	public read(): unknown {
		return this.obj_[this.key_];
	}

	/**
	 * Write a value.
	 * @param value The value to write to the target.
	 */
	public write(value: unknown): void {
		this.obj_[this.key_] = value;
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
