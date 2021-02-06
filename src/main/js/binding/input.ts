import {Emitter, EventTypeMap} from '../misc/emitter';
import {InputValue, InputValueEvents} from '../model/input-value';
import {Target} from '../model/target';

interface Config<In, Ex> {
	reader: (outerValue: unknown) => In;
	target: Target;
	value: InputValue<In>;
	writer: (innerValue: In) => Ex;
}

/**
 * @hidden
 */
export interface InputBindingEvents<In, Ex> extends EventTypeMap {
	change: {
		rawValue: In;
		sender: InputBinding<In, Ex>;
	};
}

/**
 * @hidden
 */
export class InputBinding<In, Ex> {
	public readonly emitter: Emitter<InputBindingEvents<In, Ex>>;
	public readonly target: Target;
	public readonly value: InputValue<In>;
	private reader_: (outerValue: unknown) => In;
	private writer_: (innerValue: In) => Ex;

	constructor(config: Config<In, Ex>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.reader_ = config.reader;
		this.writer_ = config.writer;
		this.emitter = new Emitter();

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);
		this.target = config.target;

		this.read();
	}

	public read(): void {
		const targetValue = this.target.read();
		if (targetValue !== undefined) {
			this.value.rawValue = this.reader_(targetValue);
		}
	}

	public getValueToWrite(rawValue: In): Ex {
		return this.writer_(rawValue);
	}

	public write_(rawValue: In): void {
		this.target.write(this.getValueToWrite(rawValue));
	}

	private onValueChange_(ev: InputValueEvents<In>['change']): void {
		this.write_(ev.rawValue);
		this.emitter.emit('change', {
			rawValue: ev.rawValue,
			sender: this,
		});
	}
}
