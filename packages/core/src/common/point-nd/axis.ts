import {Constraint} from '../constraint/constraint';
import {createNumberFormatter} from '../converter/number';
import {ValueMap} from '../model/value-map';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitablePointerScale,
} from '../number/util';
import {NumberTextProps} from '../number/view/number-text';

export interface Axis {
	baseStep: number;
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

export function createAxis(
	initialValue: number,
	constraint: Constraint<number> | undefined,
): Axis {
	return {
		baseStep: getBaseStep(constraint),
		constraint: constraint,
		textProps: ValueMap.fromObject({
			formatter: createNumberFormatter(
				getSuitableDecimalDigits(constraint, initialValue),
			),
			pointerScale: getSuitablePointerScale(constraint, initialValue),
		}),
	};
}
