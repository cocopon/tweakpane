import {Emitter} from '../model/emitter';
import {Value, ValueEvents} from '../model/value';
import {BindingTarget} from './target';

export type BindingWriter<In> = (target: BindingTarget, inValue: In) => void;

interface Config<In> {
	reader: (exValue: unknown) => In;
	target: BindingTarget;
	value: Value<In>;
	writer: BindingWriter<In>;
}

/**
 * @hidden
 */
export interface InputBindingEvents<In> {
	change: {
		rawValue: In;
		sender: InputBinding<In>;
	};
}

/**
 * @hidden
 */
export class InputBinding<In> {
	public readonly emitter: Emitter<InputBindingEvents<In>>;
	public readonly target: BindingTarget;
	public readonly value: Value<In>;
	public readonly reader: (exValue: unknown) => In;
	public readonly writer: (target: BindingTarget, inValue: In) => void;

	constructor(config: Config<In>) {
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

	private write_(rawValue: In): void {
		this.writer(this.target, rawValue);
	}

	private onValueChange_(ev: ValueEvents<In>['change']): void {
		this.write_(ev.rawValue);
		this.emitter.emit('change', {
			rawValue: ev.rawValue,
			sender: this,
		});
	}
}
