import {Emitter} from '../model/emitter';
import {Target} from '../model/target';
import {Value, ValueEvents} from '../model/value';

interface Config<In, Ex> {
	reader: (exValue: unknown) => In;
	target: Target;
	value: Value<In>;
	writer: (inValue: In) => Ex;
}

/**
 * @hidden
 */
export interface InputBindingEvents<In, Ex> {
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
	public readonly value: Value<In>;
	public readonly reader: (exValue: unknown) => In;
	public readonly writer: (inValue: In) => Ex;

	constructor(config: Config<In, Ex>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.reader = config.reader;
		this.writer = config.writer;
		this.emitter = new Emitter();

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);
		this.target = config.target;

		this.read();
	}

	public read(): void {
		const targetValue = this.target.read();
		if (targetValue !== undefined) {
			this.value.rawValue = this.reader(targetValue);
		}
	}

	public getValueToWrite(rawValue: In): Ex {
		return this.writer(rawValue);
	}

	public write_(rawValue: In): void {
		this.target.write(this.getValueToWrite(rawValue));
	}

	private onValueChange_(ev: ValueEvents<In>['change']): void {
		this.write_(ev.rawValue);
		this.emitter.emit('change', {
			rawValue: ev.rawValue,
			sender: this,
		});
	}
}
