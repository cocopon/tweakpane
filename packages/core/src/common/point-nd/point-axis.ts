import {Constraint} from '../constraint/constraint';
import {ValueMap} from '../model/value-map';
import {createNumberTextPropsObject} from '../number/util';
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
		textProps: ValueMap.fromObject(
			createNumberTextPropsObject(config.params, config.initialValue),
		),
	};
}
