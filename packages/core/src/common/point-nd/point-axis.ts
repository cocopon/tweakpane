import {Constraint} from '../constraint/constraint.js';
import {ValueMap} from '../model/value-map.js';
import {createNumberTextPropsObject} from '../number/util.js';
import {NumberTextProps} from '../number/view/number-text.js';
import {PointDimensionParams} from '../params.js';

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
		textProps: ValueMap.fromObject(
			createNumberTextPropsObject(config.params, config.initialValue),
		),
	};
}
