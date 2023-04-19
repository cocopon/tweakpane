import {Binding, BindingReader, BindingWriter} from './binding.js';
import {BindingTarget} from './target.js';

/**
 * @hidden
 */
interface Config<T> {
	reader: BindingReader<T>;
	target: BindingTarget;
	writer: BindingWriter<T>;
}

/**
 * A binding that can read and write the target.
 * @hidden
 * @template In The type of the internal value.
 */
export class ReadWriteBinding<In> implements Binding {
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

	public inject(value: unknown): void {
		this.write(this.reader_(value));
	}
}
