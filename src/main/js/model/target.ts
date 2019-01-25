import TypeUtil from '../misc/type-util';

/**
 * @hidden
 */
export default class Target {
	private key_: string;
	private obj_: object;
	private presetKey_: string;

	constructor(object: object, key: string, opt_id?: string) {
		this.obj_ = object;
		this.key_ = key;
		this.presetKey_ = TypeUtil.getOrDefault(opt_id, key);
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
}
