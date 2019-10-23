export interface InputParamsOption<T> {
	text: string;
	value: T;
}

export interface InputParamsOptionDictionary<T> {
	[key: string]: T;
}

export interface Point2dDimensionParams {
	max?: number;
	min?: number;
	step?: number;
}

interface BaseInputParams {
	label?: string;
	presetKey?: string;
}

interface BooleanInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

interface NumberInputParams extends BaseInputParams {
	max?: number;
	min?: number;
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
	step?: number;
}

interface Point2dInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
	x?: Point2dDimensionParams;
	y?: Point2dDimensionParams;
}

interface StrintrigInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

export type InputParams =
	| BooleanInputParams
	| NumberInputParams
	| Point2dInputParams
	| StrintrigInputParams;

export interface MonitorParams {
	count?: number;
	interval?: number;
	label?: string;
	max?: number;
	min?: number;
	multiline?: boolean;
	type?: string;
}

export interface ButtonParams {
	title: string;
}

export interface FolderParams {
	expanded?: boolean;
	title: string;
}
