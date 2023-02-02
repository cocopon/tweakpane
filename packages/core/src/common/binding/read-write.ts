import {BindingReader, BindingWriter} from './binding';
import {BindingTarget} from './target';

interface Config<T> {
	reader: BindingReader<T>;
	target: BindingTarget;
	writer: BindingWriter<T>;
}

/**
 * A binding that can read and write the target.
 * @template In The type of the internal value.
 */
export class ReadWriteBinding<In> {
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
