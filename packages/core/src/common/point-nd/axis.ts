import {Constraint} from '../constraint/constraint';
import {NumberTextProps} from '../number/view/number-text';

export interface Axis {
	baseStep: number;
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}
