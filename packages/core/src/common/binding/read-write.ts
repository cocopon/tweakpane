import {Binding, BindingReader, BindingWriter} from './binding';
import {BindingTarget} from './target';

interface Config<T> {
	presetKey?: string | undefined;
	reader: BindingReader<T>;
	target: BindingTarget;
	writer: BindingWriter<T>;
}

/**
 * A binding that can read and write the target.
 * @template In The type of the internal value.
 */
export class ReadWriteBinding<In> implements Binding {
	public readonly target: BindingTarget;
	public readonly presetKey: string;
	private readonly reader_: BindingReader<In>;
	private readonly writer_: BindingWriter<In>;

	constructor(config: Config<In>) {
		this.target = config.target;
		this.reader_ = config.reader;
		this.writer_ = config.writer;

		this.presetKey = config.presetKey ?? this.target.key;
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
