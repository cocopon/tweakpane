import {Binding, BindingReader} from './binding';
import {BindingTarget} from './target';

interface Config<T> {
	presetKey?: string | undefined;
	reader: BindingReader<T>;
	target: BindingTarget;
}

/**
 * A binding that can read the target.
 * @template In The type of the internal value.
 */
export class ReadonlyBinding<In> implements Binding {
	public readonly presetKey: string;
	public readonly target: BindingTarget;
	private readonly reader_: BindingReader<In>;

	constructor(config: Config<In>) {
		this.target = config.target;
		this.reader_ = config.reader;

		this.presetKey = config.presetKey ?? this.target.key;
	}

	public read(): In {
		return this.reader_(this.target.read());
	}
}
