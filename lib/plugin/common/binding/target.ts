import {TpError} from '../tp-error';

/**
 * @hidden
 */
export class BindingTarget {
	private key_: string;
	private obj_: Record<string, any>;
	private presetKey_: string;

	constructor(obj: Record<string, any>, key: string, opt_id?: string) {
		this.obj_ = obj;
		this.key_ = key;
		this.presetKey_ = opt_id ?? key;
	}

	public static isBindable(obj: unknown): obj is Record<string, any> {
		if (obj === null) {
			return false;
		}
		if (typeof obj !== 'object') {
			return false;
		}
		return true;
	}

	get key(): string {
		return this.key_;
	}

	get presetKey(): string {
		return this.presetKey_;
	}

	public read(): unknown {
		return this.obj_[this.key_];
	}

	public write(value: unknown): void {
		this.obj_[this.key_] = value;
	}

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
