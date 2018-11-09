// @flow

const NumberUtil = {
	map(value: number,  start1: number, end1: number, start2: number, end2: number): number {
		const p = (value - start1) / (end1 - start1);
		return start2 + p * (end2 - start2);
	},

	getDecimalDigits(value: number): number {
		const text = String(value.toFixed(10));
		const frac = text.split('.')[1];
		return frac.replace(/0+$/, '').length;
	},
};

export default NumberUtil;
