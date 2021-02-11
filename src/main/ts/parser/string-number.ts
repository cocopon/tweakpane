import {Parser} from './parser';

/**
 * @hidden
 */
export const StringNumberParser: Parser<string, number> = (
	text: string,
): number | null => {
	const num = parseFloat(text);
	if (isNaN(num)) {
		return null;
	}

	return num;
};
