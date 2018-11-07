// @flow

import type {Constraint} from './constraint';

type Config<T> = {
	constraints: Constraint<T>[],
};

export default class CompositeConstraint<T> implements Constraint<T> {
	constraints_: Constraint<T>[];

	constructor(config: Config<T>) {
		this.constraints_ = config.constraints;
	}

	get constraints(): Constraint<T>[] {
		return this.constraints_;
	}

	constrain(value: T): T {
		return this.constraints_.reduce((result, c) => {
			return c.constrain(result);
		}, value);
	}
}
