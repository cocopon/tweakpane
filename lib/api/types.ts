interface BaseParams {
	index?: number;
}

interface LabelableParams {
	label?: string;
}

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

export type Point2dXParams = Point2dDimensionParams;

export interface Point2dYParams extends Point2dDimensionParams {
	inverted?: boolean;
}

export interface BaseInputParams extends BaseParams, LabelableParams {
	presetKey?: string;
	view?: string;
}

export interface BooleanInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

type NumberInputType = 'color' | 'color.rgb' | 'color.rgba';

export interface NumberInputParams extends BaseInputParams {
	input?: NumberInputType;
	max?: number;
	min?: number;
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
	step?: number;
}

export interface Point2dInputParams extends BaseInputParams {
	x?: Point2dXParams;
	y?: Point2dYParams;
}

export type StringInputType = 'string';

export interface StringInputParams extends BaseInputParams {
	input?: StringInputType;
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

export type InputParams =
	| BooleanInputParams
	| NumberInputParams
	| Point2dInputParams
	| StringInputParams;

export interface BaseMonitorParams extends BaseParams, LabelableParams {
	bufferSize?: number;
	interval?: number;
	view?: string;

	// TODO: Deprecated, use `bufferSize` instead
	count?: number;
}

export interface BooleanMonitorParams extends BaseMonitorParams {
	lineCount?: number;
}

export interface NumberMonitorParams extends BaseMonitorParams {
	lineCount?: number;
	max?: number;
	min?: number;
}

export interface StringMonitorParams extends BaseMonitorParams {
	lineCount?: number;
	multiline?: boolean;
}

export type MonitorParams =
	| BooleanMonitorParams
	| NumberMonitorParams
	| StringMonitorParams;

export interface ButtonParams extends BaseParams {
	title: string;
}

export interface FolderParams extends BaseParams {
	expanded?: boolean;
	title: string;
}

export type SeparatorParams = BaseParams;