export type Parser<T> = (text: string) => T | null;

export function composeParsers<T>(parsers: Parser<T>[]): Parser<T> {
	return (text) => {
		return parsers.reduce((result: T | null, parser) => {
			if (result !== null) {
				return result;
			}
			return parser(text);
		}, null);
	};
}
