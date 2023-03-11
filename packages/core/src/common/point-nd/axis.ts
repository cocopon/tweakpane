import {Constraint} from '../constraint/constraint';
import {createNumberFormatter} from '../converter/number';
import {ValueMap} from '../model/value-map';
import {
	getSuitableDecimalDigits,
	getSuitableKeyScale,
	getSuitablePointerScale,
} from '../number/util';
import {NumberTextProps} from '../number/view/number-text';

export interface Axis {
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

export function createAxis(
	initialValue: number,
	constraint: Constraint<number> | undefined,
): Axis {
	return {
		constraint: constraint,
		textProps: ValueMap.fromObject({
			formatter: createNumberFormatter(
				getSuitableDecimalDigits(constraint, initialValue),
			),
			keyScale: getSuitableKeyScale(constraint),
			pointerScale: getSuitablePointerScale(constraint, initialValue),
		}),
	};
}
