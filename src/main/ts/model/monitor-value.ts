import {Emitter, EventTypeMap} from '../misc/emitter';

/**
 * @hidden
 */
export interface MonitorValueEvents<T> extends EventTypeMap {
	update: {
		rawValue: T;
		sender: MonitorValue<T>;
	};
}

/**
 * @hidden
 */
export class MonitorValue<T> {
	public readonly emitter: Emitter<MonitorValueEvents<T>>;
	private rawValues_: T[];
	private bufferSize_: number;

	constructor(bufferSize: number) {
		this.emitter = new Emitter();
		this.rawValues_ = [];
		this.bufferSize_ = bufferSize;
	}

	get rawValues(): T[] {
		return this.rawValues_;
	}

	get bufferSize(): number {
		return this.bufferSize_;
	}

	public append(rawValue: T): void {
		this.rawValues_.push(rawValue);

		if (this.rawValues_.length > this.bufferSize_) {
			this.rawValues_.splice(0, this.rawValues_.length - this.bufferSize_);
		}

		this.emitter.emit('update', {
			rawValue: rawValue,
			sender: this,
		});
	}
}
