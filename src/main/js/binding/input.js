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
	+target: Target;
	+value: InputValue<In>;
	reader_: (outerValue: mixed) => In;
	writer_: ?(innerValue: In) => Out;

	constructor(config: Config<In, Out>) {
		(this: any).onValueChange_ = this.onValueChange_.bind(this);

		this.reader_ = config.reader;
		this.writer_ = config.writer;

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);
		this.target = config.target;

		this.read();
	}

	read(): void {
		const targetValue = this.target.read();
		if (targetValue !== undefined) {
			this.value.rawValue = this.reader_(targetValue);
		}
	}

	write_(rawValue: In): void {
		const value = this.writer_ ? this.writer_(rawValue) : rawValue;
		this.target.write(value);
	}

	onValueChange_(rawValue: In): void {
		this.write_(rawValue);
	}
}
