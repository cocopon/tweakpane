import {BindingTarget} from './target';

/**
 * Converts an external unknown value into the internal value.
 * @template In The type of the internal value.
 */
export interface BindingReader<In> {
	/**
	 * @param exValue The bound value.
	 * @return A converted value.
	 */
	(exValue: unknown): In;
}

/**
 * Writes the internal value to the bound target.
 * @template In The type of the internal value.
 */
export interface BindingWriter<In> {
	/**
	 * @param target The target to be written.
	 * @param inValue The value to write.
	 */
	(target: BindingTarget, inValue: In): void;
}

interface Config<T> {
	reader: BindingReader<T>;
	target: BindingTarget;
	writer: BindingWriter<T>;
}

/**
 * A binding that can read and write the target.
 * @template In The type of the internal value.
 */
export class WritableBinding<In> {
	public readonly target: BindingTarget;
	private readonly reader_: BindingReader<In>;
	private readonly writer_: BindingWriter<In>;

	constructor(config: Config<In>) {
		this.target = config.target;
		this.reader_ = config.reader;
		this.writer_ = config.writer;
	}

	public read(): In {
		return this.reader_(this.target.read());
	}

	public write(value: In): void {
		this.writer_(this.target, value);
	}
}
