import * as BooleanConverter from '../../converter/boolean';
import * as NumberConverter from '../../converter/number';
import * as StringConverter from '../../converter/string';
import PaneError from '../../misc/pane-error';
import Target from '../../model/target';
import ColorParser from '../../parser/color';
import * as BooleanInputBindingControllerCreators from './boolean-input';
import * as ColorInputBindingControllerCreators from './color-input';
import * as NumberInputBindingControllerCreators from './number-input';
import * as StringInputBindingControllerCreators from './string-input';

interface Option<T> {
	text: string;
	value: T;
}

interface Params<T> {
	label?: string;
	max?: number;
	min?: number;
	options?: Option<T>[] | {[key: string]: T};
	step?: number;
}

interface NormalizedParams<T> {
	label?: string;
	max?: number;
	min?: number;
	options?: Option<T>[];
	step?: number;
}

function normalizeParams<T1, T2>(
	p1: Params<T1>,
	convert: (value: T1) => T2,
): NormalizedParams<T2> {
	const p2: NormalizedParams<T2> = {
		label: p1.label,
		max: p1.max,
		min: p1.min,
		step: p1.step,
	};
	if (p1.options) {
		if (Array.isArray(p1.options)) {
			p2.options = p1.options.map((item) => {
				return {
					text: item.text,
					value: convert(item.value),
				};
			});
		} else {
			const textToValueMap = p1.options;
			const texts = Object.keys(textToValueMap);
			p2.options = texts.reduce(
				(options, text) => {
					return options.concat({
						text: text,
						value: convert(textToValueMap[text]),
					});
				},
				[] as Option<T2>[],
			);
		}
	}
	return p2;
}

export function create(
	document: Document,
	target: Target,
	params: Params<unknown>,
) {
	const initialValue = target.read();

	if (initialValue === null || initialValue === undefined) {
		throw new PaneError({
			context: {
				key: target.key,
			},
			type: 'emptyvalue',
		});
	}

	if (typeof initialValue === 'boolean') {
		return BooleanInputBindingControllerCreators.create(
			document,
			target,
			normalizeParams(params, BooleanConverter.fromMixed),
		);
	}
	if (typeof initialValue === 'number') {
		return NumberInputBindingControllerCreators.create(
			document,
			target,
			normalizeParams(params, NumberConverter.fromMixed),
		);
	}
	if (typeof initialValue === 'string') {
		const color = ColorParser(initialValue);
		if (color) {
			return ColorInputBindingControllerCreators.create(
				document,
				target,
				color,
				params,
			);
		}

		return StringInputBindingControllerCreators.create(
			document,
			target,
			normalizeParams(params, StringConverter.fromMixed),
		);
	}

	throw new PaneError({
		context: {
			key: target.key,
		},
		type: 'nomatchingcontroller',
	});
}
