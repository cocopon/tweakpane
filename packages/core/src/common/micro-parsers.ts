import {forceCast} from '../misc/type-util.js';

type MicroParsingResult<T> =
	| {
			succeeded: true;
			value: T | undefined;
	  }
	| {
			succeeded: false;
			value: undefined;
	  };
export type MicroParser<T> = (value: unknown) => MicroParsingResult<T>;

function parseObject<O extends Record<string, unknown>>(
	value: Record<string, unknown>,
	keyToParserMap: {
		[Key in keyof O]: MicroParser<O[Key]>;
	},
): O | undefined {
	const keys: (keyof O)[] = Object.keys(keyToParserMap);
	const result = keys.reduce((tmp, key) => {
		if (tmp === undefined) {
			return undefined;
		}
		const parser = keyToParserMap[key];
		const result = parser(value[key as string]);
		return result.succeeded
			? {
					...tmp,
					[key]: result.value,
			  }
			: undefined;
	}, {} as {[Key in keyof O]: O[Key] | undefined} | undefined);
	return forceCast(result);
}

function parseArray<T>(
	value: unknown[],
	parseItem: MicroParser<T>,
): T[] | undefined {
	return value.reduce((tmp: T[] | undefined, item) => {
		if (tmp === undefined) {
			return undefined;
		}

		const result = parseItem(item);
		if (!result.succeeded || result.value === undefined) {
			return undefined;
		}
		return [...tmp, result.value];
	}, []);
}

function isObject(value: unknown): value is Record<string, unknown> {
	if (value === null) {
		return false;
	}
	return typeof value === 'object';
}

type MicroParserBuilder<T> = (optional?: boolean) => MicroParser<T>;

function createMicroParserBuilder<T>(
	parse: (value: unknown) => T | undefined,
): MicroParserBuilder<T> {
	return (optional) => (v) => {
		if (!optional && v === undefined) {
			return {
				succeeded: false,
				value: undefined,
			};
		}
		if (optional && v === undefined) {
			return {
				succeeded: true,
				value: undefined,
			};
		}

		const result = parse(v);
		return result !== undefined
			? {
					succeeded: true,
					value: result,
			  }
			: {
					succeeded: false,
					value: undefined,
			  };
	};
}

function createMicroParserBuilders(optional: boolean) {
	return {
		custom: <T>(parse: (value: unknown) => T | undefined) =>
			createMicroParserBuilder(parse)(optional),

		boolean: createMicroParserBuilder<boolean>((v) =>
			typeof v === 'boolean' ? v : undefined,
		)(optional),

		number: createMicroParserBuilder<number>((v) =>
			typeof v === 'number' ? v : undefined,
		)(optional),

		string: createMicroParserBuilder<string>((v) =>
			typeof v === 'string' ? v : undefined,
		)(optional),

		// eslint-disable-next-line @typescript-eslint/ban-types
		function: createMicroParserBuilder<Function>((v) =>
			// eslint-disable-next-line @typescript-eslint/ban-types
			typeof v === 'function' ? v : undefined,
		)(optional),

		constant: <T>(value: T) =>
			createMicroParserBuilder<T>((v) => (v === value ? value : undefined))(
				optional,
			),

		raw: createMicroParserBuilder((v: unknown) => v)(optional),

		object: <O extends Record<string, unknown>>(keyToParserMap: {
			[Key in keyof O]: MicroParser<O[Key]>;
		}) =>
			createMicroParserBuilder<O>((v) => {
				if (!isObject(v)) {
					return undefined;
				}
				return parseObject(v, keyToParserMap);
			})(optional),

		array: <T>(itemParser: MicroParser<T>) =>
			createMicroParserBuilder<T[]>((v) => {
				if (!Array.isArray(v)) {
					return undefined;
				}
				return parseArray(v, itemParser);
			})(optional),
	};
}

export const MicroParsers = {
	optional: createMicroParserBuilders(true),
	required: createMicroParserBuilders(false),
};

export function parseRecord<O extends Record<string, unknown>>(
	value: Record<string, unknown>,
	keyToParserMap: (p: typeof MicroParsers) => {
		[Key in keyof O]: MicroParser<O[Key]>;
	},
): O | undefined {
	const map = keyToParserMap(MicroParsers);
	const result = MicroParsers.required.object(map)(value);
	return result.succeeded ? result.value : undefined;
}
