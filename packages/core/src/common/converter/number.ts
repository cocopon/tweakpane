import {isEmpty} from '../../misc/type-util';
import {parseEcmaNumberExpression} from './ecma/parser';
import {Formatter} from './formatter';

export function parseNumber(text: string): number | null {
	const r = parseEcmaNumberExpression(text);
	return r?.evaluate() ?? null;
}

export function numberFromUnknown(value: unknown): number {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		const pv = parseNumber(value);
		if (!isEmpty(pv)) {
			return pv;
		}
	}

	return 0;
}

export function numberToString(value: number): string {
	return String(value);
}

export function createNumberFormatter(digits: number): Formatter<number> {
	return (value: number): string => {
		return value.toFixed(Math.max(Math.min(digits, 20), 0));
	};
}