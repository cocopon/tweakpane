import {isEmpty} from '../../../misc/type-util';
import {TpError} from '../tp-error';

/**
 * @hidden
 */
export class BindingTarget {
	private key_: string;
	private obj_: unknown;
	private presetKey_: string;

	constructor(obj: unknown, key: string, opt_id?: string) {
		this.obj_ = obj;
		this.key_ = key;
		this.presetKey_ = opt_id ?? key;
	}

	get key(): string {
		return this.key_;
	}

	get presetKey(): string {
		return this.presetKey_;
	}

	public read(): unknown {
		return (this.obj_ as any)[this.key_];
	}

	public write(value: unknown): void {
		(this.obj_ as any)[this.key_] = value;
	}

	public writeProperty(name: string, value: unknown): void {
		const valueObj: any = this.read();

		if (isEmpty(valueObj)) {
			throw TpError.valueIsEmpty(this.key_);
		}
		if (!(name in valueObj)) {
			throw TpError.propertyNotFound(name);
		}
		valueObj[name] = value;
	}
}
