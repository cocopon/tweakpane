import {Constraint} from '../constraint/constraint';
import {Formatter} from '../converter/formatter';
import {createNumberFormatter} from '../converter/number';
import {ValueMap} from '../model/value-map';
import {
	getSuitableDecimalDigits,
	getSuitableKeyScale,
	getSuitablePointerScale,
} from '../number/util';
import {NumberTextProps} from '../number/view/number-text';

export interface PointAxis {
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

export function createPointAxis(config: {
	constraint: Constraint<number> | undefined;
	initialValue: number;

	formatter?: Formatter<number>;
}): PointAxis {
	return {
		constraint: config.constraint,
		textProps: ValueMap.fromObject({
			formatter:
				config.formatter ??
				createNumberFormatter(
					getSuitableDecimalDigits(config.constraint, config.initialValue),
				),
			keyScale: getSuitableKeyScale(config.constraint),
			pointerScale: getSuitablePointerScale(
				config.constraint,
				config.initialValue,
			),
		}),
	};
}
