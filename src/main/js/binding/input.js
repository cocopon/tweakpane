// @flow

import InputValue from '../model/input-value';
import Target from '../model/target';

type Config<In, Out> = {
	reader: (outerValue: mixed) => In,
	target: Target,
	value: InputValue<In>,
	writer?: (innerValue: In) => Out,
};

export default class InputBinding<In, Out> {
	reader_: (outerValue: mixed) => In;
	target_: Target;
	value_: InputValue<In>;
	writer_: ?(innerValue: In) => Out;

	constructor(config: Config<In, Out>) {
		(this: any).onValueChange_ = this.onValueChange_.bind(this);

		this.reader_ = config.reader;
		this.writer_ = config.writer;

		this.value_ = config.value;
		this.value_.emitter.on('change', this.onValueChange_);
		this.target_ = config.target;

		this.read();
	}

	get target(): Target {
		return this.target_;
	}

	get value(): InputValue<In> {
		return this.value_;
	}

	read(): void {
		const targetValue = this.target_.read();
		if (targetValue !== undefined) {
			this.value_.rawValue = this.reader_(targetValue);
		}
	}

	write_(rawValue: In): void {
		const value = this.writer_ ?
			this.writer_(rawValue) :
			rawValue;
		this.target_.write(value);
	}

	onValueChange_(rawValue: In): void {
		this.write_(rawValue);
	}
}
