import {Parser} from './parser';

/**
 * @hidden
 */
const NumberParser: Parser<number> = (text: string): number | null => {
	const num = parseFloat(text);
	if (isNaN(num)) {
		return null;
	}

	return num;
};

export default NumberParser;
