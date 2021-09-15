import {forceCast} from '../misc/type-util';

type ParamsParsingResult<T> =
	| {
			succeeded: true;
			value: T | undefined;
	  }
	| {
			succeeded: false;
			value: undefined;
	  };
export type ParamsParser<T> = (value: unknown) => ParamsParsingResult<T>;

function parseObject<O extends Record<string, unknown>>(
	value: Record<string, unknown>,
	keyToParserMap: {
		[Key in keyof O]: ParamsParser<O[Key]>;
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
	parseItem: ParamsParser<T>,
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

type ParamsParserBuilder<T> = (optional?: boolean) => ParamsParser<T>;

function createParamsParserBuilder<T>(
	parse: (value: unknown) => T | undefined,
): ParamsParserBuilder<T> {
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

function createParamsParserBuilders(optional: boolean) {
	return {
		custom: <T>(parse: (value: unknown) => T | undefined) =>
			createParamsParserBuilder(parse)(optional),

		boolean: createParamsParserBuilder<boolean>((v) =>
			typeof v === 'boolean' ? v : undefined,
		)(optional),

		number: createParamsParserBuilder<number>((v) =>
			typeof v === 'number' ? v : undefined,
		)(optional),

		string: createParamsParserBuilder<string>((v) =>
			typeof v === 'string' ? v : undefined,
		)(optional),

		// eslint-disable-next-line @typescript-eslint/ban-types
		function: createParamsParserBuilder<Function>((v) =>
			// eslint-disable-next-line @typescript-eslint/ban-types
			typeof v === 'function' ? v : undefined,
		)(optional),

		constant: <T>(value: T) =>
			createParamsParserBuilder<T>((v) => (v === value ? value : undefined))(
				optional,
			),

		raw: createParamsParserBuilder((v: unknown) => v)(optional),

		object: <O extends Record<string, unknown>>(keyToParserMap: {
			[Key in keyof O]: ParamsParser<O[Key]>;
		}) =>
			createParamsParserBuilder<O>((v) => {
				if (!isObject(v)) {
					return undefined;
				}
				return parseObject(v, keyToParserMap);
			})(optional),

		array: <T>(itemParser: ParamsParser<T>) =>
			createParamsParserBuilder<T[]>((v) => {
				if (!Array.isArray(v)) {
					return undefined;
				}
				return parseArray(v, itemParser);
			})(optional),
	};
}

export const ParamsParsers = {
	optional: createParamsParserBuilders(true),
	required: createParamsParserBuilders(false),
};

export function parseParams<O extends Record<string, unknown>>(
	value: Record<string, unknown>,
	keyToParserMap: {[Key in keyof O]: ParamsParser<O[Key]>},
): O | undefined {
	const result = ParamsParsers.required.object(keyToParserMap)(value);
	return result.succeeded ? result.value : undefined;
}
