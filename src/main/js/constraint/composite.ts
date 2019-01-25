import {Constraint} from './constraint';

interface Config<T> {
	constraints: Constraint<T>[];
}

/**
 * @hidden
 */
export default class CompositeConstraint<T> implements Constraint<T> {
	private constraints_: Constraint<T>[];

	constructor(config: Config<T>) {
		this.constraints_ = config.constraints;
	}

	get constraints(): Constraint<T>[] {
		return this.constraints_;
	}

	public constrain(value: T): T {
		return this.constraints_.reduce((result, c) => {
			return c.constrain(result);
		}, value);
	}
}
