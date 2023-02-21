import {Binding, BindingReader} from './binding';
import {BindingTarget} from './target';

interface Config<T> {
	reader: BindingReader<T>;
	target: BindingTarget;
}

/**
 * A binding that can read the target.
 * @template In The type of the internal value.
 */
export class ReadonlyBinding<In> implements Binding {
	public readonly target: BindingTarget;
	private readonly reader_: BindingReader<In>;

	constructor(config: Config<In>) {
		this.target = config.target;
		this.reader_ = config.reader;
	}

	public read(): In {
		return this.reader_(this.target.read());
	}
}
