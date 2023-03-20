import {Constraint} from '../constraint/constraint';
import {createNumberFormatter} from '../converter/number';
import {ValueMap} from '../model/value-map';
import {
	getSuitableDecimalDigits,
	getSuitableKeyScale,
	getSuitablePointerScale,
} from '../number/util';
import {NumberTextProps} from '../number/view/number-text';
import {PointDimensionParams} from '../params';

export interface PointAxis {
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

export function createPointAxis(config: {
	constraint: Constraint<number> | undefined;
	initialValue: number;
	params: PointDimensionParams;
}): PointAxis {
	return {
		constraint: config.constraint,
		textProps: ValueMap.fromObject({
			formatter:
				config.params.format ??
				createNumberFormatter(
					getSuitableDecimalDigits(config.constraint, config.initialValue),
				),
			keyScale: getSuitableKeyScale(config.params),
			pointerScale: getSuitablePointerScale(config.params, config.initialValue),
		}),
	};
}
