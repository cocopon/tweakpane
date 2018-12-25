import InputValue from '../model/input-value';
import Target from '../model/target';

interface Config<In, Out> {
	reader: (outerValue: unknown) => In;
	target: Target;
	value: InputValue<In>;
	writer: (innerValue: In) => Out;
}

export default class InputBinding<In, Out> {
	public readonly target: Target;
	public readonly value: InputValue<In>;
	private reader_: (outerValue: unknown) => In;
	private writer_: ((innerValue: In) => Out);

	constructor(config: Config<In, Out>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.reader_ = config.reader;
		this.writer_ = config.writer;

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

	public write_(rawValue: In): void {
		const value = this.writer_(rawValue);
		this.target.write(value);
	}

	private onValueChange_(rawValue: In): void {
		this.write_(rawValue);
	}
}
